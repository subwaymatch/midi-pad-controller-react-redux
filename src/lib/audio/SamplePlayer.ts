import { clampVolume } from "@/lib/storage";

const ignore = () => {};

/**
 * Longest a hit waits for a suspended context to resume before it is dropped.
 * Short enough that a dropped hit is never heard as a late one.
 */
const RESUME_TIMEOUT_MS = 30;

/**
 * Low-latency sample playback on top of the Web Audio API.
 *
 * Samples are fetched and decoded once, then every hit starts a fresh
 * AudioBufferSourceNode, so hits can overlap like on a hardware pad and there
 * is no seek-to-zero delay as with <audio> elements. All sources run through a
 * single GainNode that carries the master volume.
 *
 * Browsers only let audio start after a user gesture, so the AudioContext is
 * created lazily by {@link unlock} or {@link play}, both of which are called
 * from gesture handlers. Before that, {@link preload} just warms the network.
 * Which events count as a gesture differs between browsers, so callers should
 * keep calling {@link unlock} until {@link isRunning} turns true.
 */
export class SamplePlayer {
  private context: AudioContext | null = null;
  private gain: GainNode | null = null;
  private volume: number;
  private readonly raw = new Map<string, Promise<ArrayBuffer>>();
  private readonly decoded = new Map<string, Promise<AudioBuffer>>();

  constructor(volume = 1) {
    this.volume = clampVolume(volume);
  }

  /** Fetches a sample (and decodes it, once audio is unlocked). Never throws. */
  preload(url: string): void {
    if (this.context) {
      this.decode(url).catch(ignore);
    } else {
      this.fetchRaw(url).catch(ignore);
    }
  }

  /** True once the context is awake and hits will actually be heard. */
  get isRunning(): boolean {
    return this.context?.state === "running";
  }

  /**
   * Creates and resumes the AudioContext. Call from a user gesture. Anything
   * already fetched is decoded now so the first hit does not have to wait.
   *
   * Safari may not treat the gesture it was called from as one that permits
   * audio, in which case the context stays suspended; check {@link isRunning}
   * rather than assuming this succeeded.
   */
  async unlock(): Promise<void> {
    const context = this.ensureContext();
    for (const url of this.raw.keys()) {
      this.decode(url).catch(ignore);
    }
    // Starting a silent source inside the gesture is what actually wakes the
    // context on older WebKit; resume() covers every other browser.
    this.kickstart(context);
    if (context.state !== "running") {
      await context.resume();
    }
  }

  /** Plays a sample from the start. Rejects if it cannot be loaded. */
  async play(url: string): Promise<void> {
    const context = this.ensureContext();
    if (context.state !== "running") {
      // resume() only settles once the browser has accepted a user gesture,
      // and on iOS it can stay pending indefinitely. Awaiting it would queue
      // up every hit made in the meantime and fire them as one burst when
      // audio finally unlocks, so a hit that cannot start now is dropped.
      await settlesWithin(context.resume(), RESUME_TIMEOUT_MS);
      if (this.context !== context || !this.isRunning) return;
    }
    const buffer = await this.decode(url);
    if (this.context !== context || !this.gain) return; // disposed meanwhile

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);
    source.start();
  }

  setVolume(volume: number): void {
    this.volume = clampVolume(volume);
    if (this.context && this.gain) {
      // A short ramp instead of a jump avoids clicks while a sample is playing.
      this.gain.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.015);
    }
  }

  /** Releases the audio hardware. The player can be reused afterwards. */
  async dispose(): Promise<void> {
    const context = this.context;
    this.context = null;
    this.gain = null;
    this.raw.clear();
    this.decoded.clear();
    if (context && context.state !== "closed") {
      await context.close();
    }
  }

  /**
   * Starts a one-sample silent buffer. Some WebKit versions only consider a
   * context started once a source has run, and this costs nothing elsewhere.
   */
  private kickstart(context: AudioContext): void {
    try {
      const source = context.createBufferSource();
      source.buffer = context.createBuffer(1, 1, context.sampleRate);
      source.connect(context.destination);
      source.start();
    } catch {
      // Best effort: resume() alone is enough on every other browser.
    }
  }

  private ensureContext(): AudioContext {
    if (!this.context) {
      const context = new AudioContext();
      const gain = context.createGain();
      gain.gain.value = this.volume;
      gain.connect(context.destination);
      this.context = context;
      this.gain = gain;
    }
    return this.context;
  }

  private fetchRaw(url: string): Promise<ArrayBuffer> {
    let pending = this.raw.get(url);
    if (!pending) {
      pending = fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load sample ${url}: HTTP ${response.status}`);
        }
        return response.arrayBuffer();
      });
      // Drop failures from the cache so a later attempt can retry.
      pending.catch(() => this.raw.delete(url));
      this.raw.set(url, pending);
    }
    return pending;
  }

  private decode(url: string): Promise<AudioBuffer> {
    let pending = this.decoded.get(url);
    if (!pending) {
      const context = this.ensureContext();
      pending = this.fetchRaw(url).then((bytes) => {
        // decodeAudioData detaches the ArrayBuffer, so the raw copy is spent.
        this.raw.delete(url);
        return context.decodeAudioData(bytes);
      });
      pending.catch(() => this.decoded.delete(url));
      this.decoded.set(url, pending);
    }
    return pending;
  }
}

/** Resolves true if `promise` settles within `ms`, false if it is still pending. */
function settlesWithin(promise: Promise<unknown>, ms: number): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), ms);
    const settle = (settled: boolean) => {
      clearTimeout(timer);
      resolve(settled);
    };
    promise.then(
      () => settle(true),
      () => settle(false),
    );
  });
}
