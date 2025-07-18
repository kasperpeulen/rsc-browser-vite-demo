import { expect, test, vi } from "vitest";
import { setServerCallback } from "@vitejs/plugin-rsc/react/browser";
import { page } from "@vitest/browser/context";
import { render } from "../test/render.tsx";
import { Users } from "./users.tsx";
import { api, msw } from "../test/msw.ts";
import { http } from "msw";

const serverAction = vi.fn();
setServerCallback(serverAction);

test("save to db when clicked", async () => {
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
