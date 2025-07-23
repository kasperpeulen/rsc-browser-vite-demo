/* eslint-disable @typescript-eslint/no-explicit-any */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginRsc } from "./src/plugin/plugin.ts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  clearScreen: false,
  plugins: [
    tsconfigPaths(),
    vitePluginRsc(),
    react(),
    {
      name: "invokeReactClient",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url ?? "/", "https://any.local");
          if (url.pathname === "/@vite/invoke-react-client") {
            const payload = JSON.parse(url.searchParams.get("data")!);
            const result =
              await server.environments["react_client"]!.hot.handleInvoke(
                payload,
              );
            res.end(JSON.stringify(result));
            return;
          }
          next();
        });
      },
      hotUpdate(ctx) {
        // TODO find out how to do HMR
        ctx.server.ws.send({ type: "full-reload", path: ctx.file });
      },
    },
  ],
  resolve: {
    alias: {
      "next/link": "next/dist/client/link",
      "@vitejs/plugin-rsc/vendor/react-server-dom/server.edge":
        "@vitejs/plugin-rsc/vendor/react-server-dom/server.browser",
      "@vitejs/plugin-rsc/vendor/react-server-dom/client.edge":
        "@vitejs/plugin-rsc/vendor/react-server-dom/client.browser",
    },
  },
  environments: {
    client: {
      keepProcessEnv: false,
      resolve: {
        conditions: ["browser", "react-server"],
      },
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "react-dom/client",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "next/link",
          "next/dist/server/web/spec-extension/adapters/request-cookies",
          "next/dist/compiled/@edge-runtime/cookies",
          "sanitize-html",
          "next/headers",
          "@vitejs/plugin-rsc/vendor/react-server-dom/server.browser",
          "@vitejs/plugin-rsc/vendor/react-server-dom/server.edge",
          "@vitejs/plugin-rsc/vendor/react-server-dom/client.edge",
          "@vitejs/plugin-rsc/vendor/react-server-dom/client.browser",
        ],
      },
    },
    react_client: {
      keepProcessEnv: false,
      resolve: {
        conditions: ["browser"],
        noExternal: true,
      },
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "react-dom/client",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "next/link",
          "next/dist/server/web/spec-extension/adapters/request-cookies",
          "next/dist/compiled/@edge-runtime/cookies",
          "sanitize-html",
          "@vitejs/plugin-rsc/vendor/react-server-dom/client.browser",
        ],
        exclude: ["fsevents"],
        esbuildOptions: {
          platform: "browser",
        },
      },
    },
  },
});
