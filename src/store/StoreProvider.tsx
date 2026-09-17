"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { loadPersistedState } from "@/lib/storage";
import { hydrateFromStorage } from "./actions";
import { makeStore } from "./index";

export function StoreProvider({ children }: { children: ReactNode }) {
  // One store per browser session, created lazily on the first render.
  const [store] = useState(makeStore);

  // The server and the first client render both use the default layout, which
  // keeps hydration free of mismatches. Saved settings are applied in a layout
  // effect: it runs after hydration but before the browser paints, so the
  // user never sees the defaults flash by.
  useLayoutEffect(() => {
    store.dispatch(hydrateFromStorage(loadPersistedState()));
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
