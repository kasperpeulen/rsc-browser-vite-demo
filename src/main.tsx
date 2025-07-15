import "./polyfill-webpack";

// @ts-expect-error missing types
import { renderToReadableStream } from "react-server-dom-webpack/server";
import { type JSX, type Usable } from "react";
import { importReactClient } from "./react-client/import";
import { Story } from "./components/users.stories";

const { use, createRoot, createFromReadableStream } = await importReactClient(
  "/src/react-client/entry.tsx",
);

function Use({ value }: { value: Usable<JSX.Element> }) {
  return use(value);
}

const root = createRoot(document.getElementById("root")!);

renderStory();

function renderStory() {
  const stream = renderToReadableStream(<Story />, {}, {});
  root.render(<Use value={createFromReadableStream(stream)} />);
}
