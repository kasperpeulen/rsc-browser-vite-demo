import { expect, test, vi } from "vitest";
import { setServerCallback } from "@vitejs/plugin-rsc/react/browser";
import { page } from "@vitest/browser/context";
import { render } from "../test/render.tsx";
import { Users } from "./users.tsx";
import { getAllUsers } from "../lib/api.ts";
import { api, msw } from "../test/msw.ts";
import { http } from "msw";

vi.mock(import("../lib/api.ts"));
const serverAction = vi.fn();
setServerCallback(serverAction);

test("save to db when clicked", async () => {
  vi.mocked(getAllUsers).mockResolvedValue([{ id: 5, name: "some user" }]);

  msw.use(
    http.get(api("/users"), () =>
      Response.json([{ id: 5, name: "some user" }]),
    ),
  );

  render(<Users />);

  await page.getByRole("button", { name: "Toggle" }).first().click();
  await page.getByRole("button", { name: "Like" }).click();

  expect(serverAction).toBeCalledWith(
    expect.stringContaining("saveToDb"),
    [5, 1],
  );
});
