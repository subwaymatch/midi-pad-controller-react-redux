import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { savePads, saveVolume } from "@/lib/storage";
import editMode from "./editModeSlice";
import editor from "./editorSlice";
import hydrated from "./hydratedSlice";
import pads from "./padsSlice";
import volume from "./volumeSlice";

const rootReducer = combineReducers({ pads, volume, editor, editMode, hydrated });

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Builds a fresh store. Called once per browser session by StoreProvider and
 * once per test, so state never leaks between them.
 */
export function makeStore(preloadedState?: Partial<RootState>) {
  const persistence = createListenerMiddleware<RootState>();

  persistence.startListening({
    predicate: (_action, current, previous) => current.pads !== previous.pads,
    effect: (_action, api) => savePads(api.getState().pads),
  });

  persistence.startListening({
    predicate: (_action, current, previous) => current.volume !== previous.volume,
    effect: (_action, api) => saveVolume(api.getState().volume),
  });

  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistence.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
