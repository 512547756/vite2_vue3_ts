import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
//@ts-ignore
import viteCompression from "vite-plugin-compression";

const resolve = (dir: string) => path.join(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  base: "./", // 打包路径
  css: {
    // 全局配置main.scss
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/main.scss";',
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  //启动服务配置
  server: {
    host: "0.0.0.0",
    port: 8000,
    open: true,
    cors: true,
    https: false,
    // proxy: {
    //   // 选项写法
    //   '/api': 'http://xxxx'// 代理网址
    // },
  },
  // 生产环境打包配置
  //去除 console debugger
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
