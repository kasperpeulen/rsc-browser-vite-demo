import { test } from "vitest";
import { renderServer } from "../src/test/render.tsx";
import NoteEditor from "./note-editor.tsx";
import { setServerCallback } from "@vitejs/plugin-rsc/react/browser";
import { loadServerAction } from "@vitejs/plugin-rsc/core/rsc";
import { page } from "@vitest/browser/context";

test("note editor can be saved", async () => {
  renderServer(
    <NoteEditor
      noteId="1"
      initialTitle="This is a tile"
      initialBody="This is a body"
    />,
  );

  setServerCallback(async (id: string, args: unknown[]) => {
    console.log(`action called with`, { id, args });
    const action = await loadServerAction(id);
    console.log(action);
    return action?.(...args);
  });

  await page.getByRole("menuitem", { name: "Done" }).click();
});
