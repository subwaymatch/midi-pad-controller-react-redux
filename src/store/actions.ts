import { createAction } from "@reduxjs/toolkit";
import type { PersistedState } from "@/lib/storage";

/**
 * Dispatched once on the client after React hydrates, carrying the layout and
 * volume read from localStorage. Lives outside the slices so several of them
 * can respond to it without importing each other.
 */
export const hydrateFromStorage = createAction<PersistedState>("storage/hydrate");
