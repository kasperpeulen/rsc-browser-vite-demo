import {
  coverageConfigDefaults,
  defaultExclude,
  defineConfig,
} from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  resolve: {
    alias: {
      "next/headers": "./__mocks__/next/headers.ts",
    },
  },
  test: {
    exclude: [...defaultExclude, "./src/plugin"],
    include: ["./**/*.test.tsx"],
    restoreMocks: true,
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      screenshotFailures: false,
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      all: true,
      include: ["{app,lib,components}/**/*"],
      exclude: [...coverageConfigDefaults.exclude, "**/*.{mock}.*"],
    },
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
