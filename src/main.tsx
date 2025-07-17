import { Story } from "./components/users.stories";
import { render } from "./test/render.tsx";
import { setRequireModule } from "@vitejs/plugin-rsc/core/browser";
import { importReactClient } from "./react-client/import.ts";
import { setServerCallback } from "@vitejs/plugin-rsc/react/browser";

function main() {
  setRequireModule({
    load: (id) => importReactClient(id),
  });

  setServerCallback(async (id: string, args: unknown[]) => {
    console.log(`action called with`, { id, args });

    const [filepath, name] = id!.split("#");
    const module = await import(/* @vite-ignore */ filepath);
    const action = module[name];
    return action?.(...args);
  });

  render(<Story />);
}

main();
