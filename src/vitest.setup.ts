import { setRequireModule } from "@vitejs/plugin-rsc/core/browser";
import { importReactClient } from "./react-client/import";
import { beforeEach } from "vitest";
import { cleanup } from "./test/render.tsx";

setRequireModule({
  load: (id) => importReactClient(id),
});

beforeEach(() => {
  cleanup();
});
