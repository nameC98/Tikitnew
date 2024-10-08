import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/opn": {
  //       target: "http://api.tikiti.co.zw",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/opn/, "/opn"),
  //     },
  //   },
  // },
});
