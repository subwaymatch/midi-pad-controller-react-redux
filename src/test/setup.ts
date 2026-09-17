import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";
import {
  forgetOpenModals,
  installBrowserStubs,
  resetMediaQueryMatcher,
} from "./browser";

beforeAll(installBrowserStubs);

afterEach(() => {
  cleanup();
  forgetOpenModals();
  resetMediaQueryMatcher();
  localStorage.clear();
});
