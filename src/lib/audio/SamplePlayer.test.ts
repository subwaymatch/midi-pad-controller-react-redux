import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SamplePlayer } from "./SamplePlayer";

interface FakeSource {
  buffer: AudioBuffer | null;
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
}

const created: FakeAudioContext[] = [];

/** Stands in for iOS, where resume() stays pending until an accepted gesture. */
let resumeHangs = false;

class FakeAudioContext {
  state: AudioContextState = "suspended";
  currentTime = 0;
  destination = {};
  sources: FakeSource[] = [];
  gain = { gain: { value: 1, setTargetAtTime: vi.fn() }, connect: vi.fn() };
  sampleRate = 44100;
  resume = vi.fn(() => {
    if (resumeHangs) return new Promise<void>(() => {});
    this.state = "running";
    return Promise.resolve();
  });
  createBuffer = vi.fn(
    (channels: number, length: number) => ({ numberOfChannels: channels, length }) as AudioBuffer,
  );
  close = vi.fn(async () => {
    this.state = "closed";
  });
  decodeAudioData = vi.fn(async (bytes: ArrayBuffer) => ({ length: bytes.byteLength }) as AudioBuffer);

  constructor() {
    created.push(this);
  }
  createGain() {
    return this.gain;
  }
  createBufferSource(): FakeSource {
    const source = { buffer: null, connect: vi.fn(), start: vi.fn() };
    this.sources.push(source);
    return source;
  }
}

const fetchMock = vi.fn();

function respondWith(status: number) {
  return { ok: status >= 200 && status < 300, status, arrayBuffer: async () => new ArrayBuffer(8) };
}

beforeEach(() => {
  created.length = 0;
  resumeHangs = false;
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => respondWith(200));
  vi.stubGlobal("AudioContext", FakeAudioContext);
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SamplePlayer", () => {
  it("preloads over the network without creating an AudioContext", async () => {
    const player = new SamplePlayer();
    player.preload("/sounds/a.wav");
    player.preload("/sounds/a.wav");
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(created).toHaveLength(0);
  });

  it("decodes once and starts a fresh source for every hit", async () => {
    const player = new SamplePlayer(0.5);
    await player.play("/sounds/a.wav");
    await player.play("/sounds/a.wav");

    const [context] = created;
    expect(created).toHaveLength(1);
    expect(context!.resume).toHaveBeenCalled();
    expect(context!.gain.gain.value).toBe(0.5);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(context!.decodeAudioData).toHaveBeenCalledTimes(1);
    expect(context!.sources).toHaveLength(2);
    for (const source of context!.sources) {
      expect(source.connect).toHaveBeenCalledWith(context!.gain);
      expect(source.start).toHaveBeenCalledTimes(1);
    }
  });

  it("does not cache failures, so the next hit retries", async () => {
    fetchMock.mockImplementationOnce(async () => respondWith(404));
    const player = new SamplePlayer();

    await expect(player.play("/sounds/a.wav")).rejects.toThrow(/HTTP 404/);
    await expect(player.play("/sounds/a.wav")).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("ramps the gain when the volume changes after unlock", async () => {
    const player = new SamplePlayer(1);
    await player.unlock();
    player.setVolume(0.2);

    const [context] = created;
    expect(context!.gain.gain.setTargetAtTime).toHaveBeenCalledWith(0.2, 0, expect.any(Number));
  });

  it("nudges the context awake with a silent buffer on unlock", async () => {
    const player = new SamplePlayer();
    expect(player.isRunning).toBe(false);

    await player.unlock();

    const [context] = created;
    expect(context!.createBuffer).toHaveBeenCalledWith(1, 1, 44100);
    expect(context!.sources).toHaveLength(1);
    expect(player.isRunning).toBe(true);
  });

  it("stays locked when the browser does not accept the gesture", () => {
    resumeHangs = true;
    const player = new SamplePlayer();

    void player.unlock();

    // Safari can leave resume() pending forever; the caller has to be able to
    // see that and keep listening for another gesture.
    expect(player.isRunning).toBe(false);
  });

  it("drops a hit rather than queueing it while audio is still locked", async () => {
    resumeHangs = true;
    const player = new SamplePlayer();

    await player.play("/sounds/a.wav");

    // Awaiting the pending resume() would hold every hit and fire them all at
    // once whenever audio finally unlocks.
    const [context] = created;
    expect(context!.sources).toHaveLength(0);
  });

  it("closes the context on dispose and can be used again afterwards", async () => {
    const player = new SamplePlayer();
    await player.play("/sounds/a.wav");
    await player.dispose();
    expect(created[0]!.close).toHaveBeenCalled();

    await player.play("/sounds/a.wav");
    expect(created).toHaveLength(2);
  });
});
