import { useEffect, useRef } from "react";

/**
 * Whether the thing the user just did came from a pointer rather than a key.
 *
 * Not a general "which input is this person on" flag: the pad shortcuts make
 * keydown the most common event in the app, so all this answers is what drove
 * the interaction in hand. Effects use it to tell a keyboard user who would be
 * stranded without focus being moved for them from a mouse user, whose
 * attention is already wherever they clicked and who gets nothing from it but
 * a focus ring on a control they are not looking at.
 *
 * A ref rather than state: nothing renders differently, and re-rendering the
 * pad grid on every note played would be a poor trade for a flag only effects
 * read.
 */
export function usePointerDriven() {
  const pointerDriven = useRef(false);

  useEffect(() => {
    const fromPointer = () => {
      pointerDriven.current = true;
    };
    const fromKeyboard = () => {
      pointerDriven.current = false;
    };

    // Capture, so the flag is already current when a handler that acts on the
    // same event runs.
    window.addEventListener("pointerdown", fromPointer, true);
    window.addEventListener("keydown", fromKeyboard, true);
    return () => {
      window.removeEventListener("pointerdown", fromPointer, true);
      window.removeEventListener("keydown", fromKeyboard, true);
    };
  }, []);

  return pointerDriven;
}
