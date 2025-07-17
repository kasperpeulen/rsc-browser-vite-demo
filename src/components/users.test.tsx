import { expect, test, vi } from "vitest";
import { setServerCallback } from "@vitejs/plugin-rsc/react/browser";
import { page } from "@vitest/browser/context";
import { render } from "../test/render.tsx";
import { Users } from "./users.tsx";
import { getAllUsers } from "../lib/api.ts";

vi.mock(import("../lib/api.ts"));
const serverAction = vi.fn();
setServerCallback(serverAction);

test("save to db when clicked", async () => {
  vi.mocked(getAllUsers).mockResolvedValue([{ id: 5, name: "some user" }]);

  render(<Users />);

  await page.getByRole("button", { name: "Like" }).first().click();
  await page.getByRole("button", { name: "Like" }).first().click();

  expect(serverAction).toBeCalledWith(
    expect.stringContaining("src/components/actions.ts#saveToDb"),
    [5, 2],
  );
});
