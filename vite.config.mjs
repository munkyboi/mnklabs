import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { contactMiddleware } from "./server/express-contact.mjs";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), {
    name: "mnklabs-contact-api",
    configureServer(server) {
      const env = { ...loadEnv(server.config.mode, process.cwd(), ""), ...process.env };
      server.middlewares.use("/api/contact", contactMiddleware(env));
    },
  }],
});
