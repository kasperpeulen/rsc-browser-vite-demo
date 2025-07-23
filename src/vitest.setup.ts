// @ts-expect-error not mocking everything
globalThis.process = {
  env: {},
};

import "app/style.css";

import { setRequireModule } from "@vitejs/plugin-rsc/core/browser";
import { importReactClient } from "./react-client/import";
import { beforeAll, beforeEach, vi } from "vitest";
import { cleanup } from "./test/render.tsx";
import { msw } from "./test/msw.ts";
import { setRequireModule as setRequireServerModule } from "@vitejs/plugin-rsc/core/rsc";

vi.mock(import("@vercel/kv"));
vi.mock(import("../libs/session"), { spy: true });

setRequireModule({ load: (id) => importReactClient(id) });

setRequireServerModule({ load: (id) => import(/* @vite-ignore */ id) });

beforeAll(async () => {
  await msw.start({ quiet: true });
});

beforeEach(() => {
  msw.resetHandlers();
  cleanup();
});
