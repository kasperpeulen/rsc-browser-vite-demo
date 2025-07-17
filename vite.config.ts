import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// @ts-expect-error no dts file
import { transformSource } from "react-server-dom-webpack/node-loader";
import vitePluginRscCore from "@vitejs/plugin-rsc/core/plugin";

export default defineConfig({
  clearScreen: false,
  plugins: [
    vitePluginRscCore(),
    {
      name: "react-server",
      enforce: "pre",
      async transform(code, id) {
        if (this.environment.name === "client") {
          const context = { format: "module", url: id };

          const { source } = await transformSource(
            code,
            context,
            async (source: string) => ({
              source,
            }),
          );

          return source as string;
        }
      },
    },
    react(),
    {
      name: "vitePluginFetchReactClientModuleServer",
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
    },
  ],
  environments: {
    client: {
      keepProcessEnv: false,
      resolve: {
        conditions: ["browser", "react-server"],
      },
      optimizeDeps: {
        include: [
          "react",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "react-server-dom-webpack/server",
          "@vitejs/plugin-rsc/vendor/react-server-dom/server.browser",
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
          "react-dom/client",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@vitejs/plugin-rsc/vendor/react-server-dom/client.browser",
        ],
        esbuildOptions: {
          platform: "browser",
        },
      },
    },
  },
});
