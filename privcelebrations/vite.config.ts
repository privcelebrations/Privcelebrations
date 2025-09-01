import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // INCREASE CHUNK SIZE WARNING LIMIT
    chunkSizeWarningLimit: 800, // Increased from default 500kB
    // ADD ROLLUP OPTIONS FOR MANUAL CHUNKING
    rollupOptions: {
      output: {
        // Automatic vendor chunking strategy
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Extract the package name
            const packageName = id.toString().split('node_modules/')[1].split('/')[0];
            // Group React-related packages together
            if (packageName.includes('react')) {
              return 'vendor-react';
            }
            // Group other large packages separately for better caching
            if (['three', 'lodash', 'moment', 'chart.js', 'axios'].includes(packageName)) {
              return `vendor-${packageName}`;
            }
            // Group all other packages into vendor-common
            return 'vendor-common';
          }
        }
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
