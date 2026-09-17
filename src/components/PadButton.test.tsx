import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PadButton } from "./PadButton";

const pad = { srcName: "Kick Acoustic01", shortcutKey: "a", color: "blue" } as const;

/** What the pad prints on its face. */
const VISIBLE_LABEL = "Kick / A";

function renderPad(overrides: Partial<Parameters<typeof PadButton>[0]> = {}) {
  const onPlay = vi.fn();
  const onEdit = vi.fn();
  render(
    <PadButton
      pad={pad}
      isLit={false}
      isEditing={false}
      editMode={false}
      onPlay={onPlay}
      onEdit={onEdit}
      {...overrides}
    />,
  );
  // The pad itself, as opposed to the "Edit pad A: ..." button beside it.
  return { onPlay, onEdit, trigger: screen.getByRole("button", { name: /^Kick/ }) };
}

/** The label element on the pad face. */
function padLabel(trigger: HTMLElement): string {
  return trigger.firstElementChild!.textContent!;
}

/** The text a name computation joins up, with element spacing normalised. */
function accessibleText(trigger: HTMLElement): string {
  return trigger.textContent!.replace(/\s+/g, " ").trim();
}

describe("PadButton", () => {
  it("shows the short sample name and the shortcut key", () => {
    const { trigger } = renderPad();
    expect(padLabel(trigger)).toBe(VISIBLE_LABEL);
  });

  it("keeps the visible label inside its accessible name", () => {
    const { trigger } = renderPad();
    // WCAG 2.5.3. The name comes from the content rather than an aria-label
    // precisely so the two cannot drift apart: the printed label opens it, and
    // the full sample name and the key follow.
    expect(trigger).not.toHaveAttribute("aria-label");
    expect(accessibleText(trigger).startsWith(VISIBLE_LABEL)).toBe(true);
    expect(accessibleText(trigger)).toContain("Kick Acoustic01, shortcut key A");
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

  describe("in edit mode", () => {
    it("opens the editor on release and does not play", () => {
      const { onPlay, onEdit, trigger } = renderPad({ editMode: true });

      fireEvent.pointerDown(trigger, { button: 0 });
      expect(onPlay).not.toHaveBeenCalled();
      expect(onEdit).not.toHaveBeenCalled();

      fireEvent.click(trigger, { detail: 1 });

      expect(onPlay).not.toHaveBeenCalled();
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("says so in the pad's accessible name, keeping the visible label", () => {
      const { trigger } = renderPad({ editMode: true });

      expect(padLabel(trigger)).toBe(VISIBLE_LABEL);
      expect(accessibleText(trigger)).toContain("Kick Acoustic01, edit this pad");
    });
  });
});
