import type { JSX, Usable } from "react";
import { importReactClient } from "../react-client/import";

const {
  default: { use },
} = await importReactClient<{ default: typeof import("react") }>("react");

export function Use({ value }: { value: Usable<JSX.Element> }) {
  return use(value);
}
