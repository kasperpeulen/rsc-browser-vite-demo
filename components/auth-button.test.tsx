import { expect, test, vi } from "vitest";
import { renderServer } from "../src/test/render.tsx";
import AuthButton from "./auth-button.tsx";
import { page } from "@vitest/browser/context";
import { getUser } from "../libs/session.ts";

vi.mock(import("../libs/session"), { spy: true });

test("renders login button when logged out", async () => {
  renderServer(<AuthButton noteId={null}>Add</AuthButton>);

  await expect
    .element(page.getByRole("menuitem", { name: "Login to Add" }))
    .toBeVisible();
});

test("renders add button when logged in", async () => {
  vi.mocked(getUser).mockReturnValue("some-user");

  renderServer(<AuthButton noteId={null}>Add</AuthButton>);

  await expect
    .element(page.getByRole("menuitem", { name: "Add" }))
    .toBeVisible();
});

test("renders outlined edit button for a specific note", async () => {
  vi.mocked(getUser).mockReturnValue("some-user");

  renderServer(<AuthButton noteId="1">Edit</AuthButton>);

  const menuItem = page.getByRole("menuitem", { name: "Edit" });
  await expect.element(menuItem).toBeVisible();
  await expect.element(menuItem).toHaveClass("edit-button--outline");
});
