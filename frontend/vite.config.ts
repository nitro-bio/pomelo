import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@/", replacement: "/src/" }],
  },
  build: {
    sourcemap: true,
    target: "es2020",
    minify: "oxc",
    commonjsOptions: { transformMixedEsModules: true }, // needed for ketcher
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: "ketcher_lib",
              test: /^node_modules\/ketcher-(?:core|standalone)$/,
              priority: 120, // keep it separate even when imported once
            },
          ],
        },
      },
    },
  },
  define: {
    global: "window", // needed by draft-js (ketcher dependency)
    "process.env.DUMMY_VAL_FOR_KETCHER": JSON.stringify("true"), // define process.env for ketcher
  },
});
