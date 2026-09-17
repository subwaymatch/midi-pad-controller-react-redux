/**
 * Stand-ins for two browser features jsdom does not implement, without which
 * the pad editor cannot be rendered in a test at all.
 */

let matcher: (query: string) => boolean = () => false;

/** Decides what `window.matchMedia(...).matches` answers for the next render. */
export function setMediaQueryMatcher(next: (query: string) => boolean): void {
  matcher = next;
}

export function resetMediaQueryMatcher(): void {
  matcher = () => false;
}

const openModals = new Set<HTMLDialogElement>();

export function installBrowserStubs(): void {
  window.matchMedia ??= (query: string) =>
    ({
      get matches() {
        return matcher(query);
      },
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;

  if (typeof HTMLDialogElement.prototype.showModal === "function") return;

  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
    openModals.add(this);
  };

  HTMLDialogElement.prototype.close = function close(
    this: HTMLDialogElement,
    returnValue?: string,
  ) {
    if (!this.open) return;
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.open = false;
    openModals.delete(this);
    this.dispatchEvent(new Event("close"));
  };

  // Escape on a modal dialog raises `cancel`, and closes it unless the page
  // handles that event itself.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const dialog of [...openModals]) {
      const proceed = dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
      if (proceed) dialog.close();
    }
  });
}

export function forgetOpenModals(): void {
  openModals.clear();
}
