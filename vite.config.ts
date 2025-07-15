import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  clearScreen: false,
  plugins: [
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
          "react-server-dom-webpack/client",
        ],
        esbuildOptions: {
          platform: "browser",
        },
      },
    },
  },
});
