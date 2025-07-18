import { defaultExclude, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    exclude: [...defaultExclude, "./src/plugin"],
    restoreMocks: true,
    browser: {
      enabled: true,
      provider: "playwright",
      screenshotFailures: false,
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: "chromium" }],
    },
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
