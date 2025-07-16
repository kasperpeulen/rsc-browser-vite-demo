Object.assign(globalThis, {
  __webpack_require__: () => {
    throw new Error("__webpack_require__ not yet initialized");
  },
});

import { importReactClient } from "./react-client/import.ts";
import { memoize } from "@hiogawa/utils";

Object.assign(globalThis, {
  __webpack_require__: memoize((id: string) => {
    return importReactClient(id);
  }),
});
