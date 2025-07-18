import { setRequireModule } from "@vitejs/plugin-rsc/core/browser";
import { importReactClient } from "./react-client/import";
import { beforeAll, beforeEach } from "vitest";
import { cleanup } from "./test/render.tsx";
import { msw } from "./test/msw.ts";
import { setRequireModule as setRequireServerModule } from "@vitejs/plugin-rsc/core/rsc";

setRequireModule({
  load: (id) => importReactClient(id),
});

setRequireServerModule({
  load: (id) => import(/* @vite-ignore */ id),
});

beforeAll(() => msw.start({ quiet: true }));

beforeEach(() => {
  msw.resetHandlers();
  cleanup();
});
