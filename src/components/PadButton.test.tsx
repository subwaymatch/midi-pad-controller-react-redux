import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PadButton } from "./PadButton";

const pad = { srcName: "Kick Acoustic01", shortcutKey: "a", color: "blue" } as const;

function renderPad(overrides: Partial<Parameters<typeof PadButton>[0]> = {}) {
  const onPlay = vi.fn();
  const onEdit = vi.fn();
  render(<PadButton pad={pad} isLit={false} isEditing={false} onPlay={onPlay} onEdit={onEdit} {...overrides} />);
  return { onPlay, onEdit, trigger: screen.getByRole("button", { name: /Kick Acoustic01, shortcut key A/ }) };
}

describe("PadButton", () => {
  it("shows the short sample name and the shortcut key", () => {
    renderPad();
    expect(screen.getByText("Kick / a")).toBeInTheDocument();
  });

  it("plays on primary pointer down, once per press", () => {
    const { onPlay, trigger } = renderPad();

    fireEvent.pointerDown(trigger, { button: 0 });
    fireEvent.click(trigger, { detail: 1 });

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("plays on keyboard activation", () => {
    const { onPlay, trigger } = renderPad();

    fireEvent.click(trigger, { detail: 0 });

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("opens the editor on right-click instead of playing", () => {
    const { onPlay, onEdit, trigger } = renderPad();

    fireEvent.pointerDown(trigger, { button: 2 });
    fireEvent.contextMenu(trigger);

    expect(onPlay).not.toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("opens the editor from the edit button", () => {
    const { onEdit } = renderPad();

    fireEvent.click(screen.getByRole("button", { name: /Edit pad A/ }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("marks the pad while it is being edited", () => {
    renderPad({ isEditing: true });
    expect(screen.getByText("Editing")).toBeInTheDocument();
  });
});
