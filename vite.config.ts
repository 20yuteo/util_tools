import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';

export default defineConfig({
	resolve: {
    alias: {
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      http: path.resolve(__dirname, 'node_modules/stream-http'),
      https: path.resolve(__dirname, 'node_modules/https-browserify'),
      zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
    },
  },
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
