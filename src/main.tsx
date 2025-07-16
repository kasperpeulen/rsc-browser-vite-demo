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

const manifest = new Proxy(
  {},
  {
    get(_target, $$id: string) {
      const [id, name] = $$id.split("#");
      return {
        id,
        name,
        chunks: [],
        async: true,
      };
    },
  },
);

const root = createRoot(document.getElementById("root")!);

renderStory();

function renderStory() {
  const stream = renderToReadableStream(<Story />, manifest);
  root.render(
    <Use
      value={createFromReadableStream(stream, {
        callServer: async (id: string, args: unknown[]) => {
          console.log(`action called with`, { id, args });

          const [filepath, name] = id!.split("#");
          const module = await import(/* @vite-ignore */ filepath);
          const action = module[name];
          return action?.(...args);
        },
      })}
    />,
  );
}
