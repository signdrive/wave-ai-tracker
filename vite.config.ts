
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import process from "process";

// Custom plugin to print server URL and exit
const printServerUrlAndExitPlugin = (): Plugin => {
  return {
    name: 'print-server-url-and-exit',
    apply: 'serve', // Apply only in serve mode (dev)
    configureServer(server) {
      console.log("DEBUG: printServerUrlAndExitPlugin - configureServer hook invoked"); // Test log

      // Temporarily removed the listening event and process.exit(0) for debugging
      // server.httpServer?.on('listening', () => {
      //   const address = server.httpServer?.address();
      //   if (address && typeof address === 'object') {
      //     const host = address.address === '127.0.0.1' ? 'localhost' : address.address;
      //     const port = address.port;
      //     console.log(`  > Local: http://${host}:${port}/`);
      //     process.exit(0);
      //   }
      // });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`DEBUG: vite.config.ts - defineConfig called. Mode: ${mode}`); // Log mode
  return {
    server: {
      host: "127.0.0.1", // Changed from "::" to "127.0.0.1"
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      printServerUrlAndExitPlugin(), // Add the custom plugin unconditionally for this test
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // SPA ROUTING FIX - Add preview configuration for production builds
    preview: {
      port: 8080,
      host: "127.0.0.1",
      // Configure fallback for SPA routing in preview mode
      proxy: undefined,
    },
    build: {
      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
            charts: ['recharts'],
            query: ['@tanstack/react-query'],
            router: ['react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            // App chunks
            components: [
              './src/components/SessionLogger',
              './src/components/SurfForecast',
              './src/components/SurfCamDisplay'
            ],
          },
        },
      },
      // CSS optimization to reduce render-blocking
      cssCodeSplit: false, // Bundle CSS into single file for better caching
      cssMinify: true,
      // Inline critical CSS for faster initial render
      cssTarget: 'esnext',
      // Enable source maps in production for debugging
      sourcemap: mode === 'production' ? 'hidden' : true,
      // Optimize bundle size
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Set chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'lucide-react',
      ],
    },
  };
});
