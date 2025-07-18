import { Story } from "./components/users.stories";
import { render } from "./test/render.tsx";
import { setRequireModule } from "@vitejs/plugin-rsc/core/browser";
import {
  loadServerAction,
  setRequireModule as setRequireServerModule,
} from "@vitejs/plugin-rsc/core/rsc";
import { importReactClient } from "./react-client/import.ts";
import { setServerCallback } from "@vitejs/plugin-rsc/react/browser";

function main() {
  setRequireModule({
    load: (id) => importReactClient(id),
  });

  setRequireServerModule({
    load: (id) => import(/* @vite-ignore */ id),
  });

  const { rerender } = render(<Story />);

  setServerCallback(async (id: string, args: unknown[]) => {
    console.log(`action called with`, { id, args });
    const action = await loadServerAction(id);
    setTimeout(() => {
      rerender(<Story />);
    }, 0);
    return action?.(...args);
  });
}

main();
