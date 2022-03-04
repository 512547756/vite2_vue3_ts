import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
//@ts-ignore
import viteCompression from "vite-plugin-compression";

// 实现自动按需加载
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  NaiveUiResolver,
  VueUseComponentsResolver,
} from "unplugin-vue-components/resolvers"; //插件需要的resolver 包含主流UI https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/naive-ui.ts

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
    // ===实现自动按需加载 start===
    AutoImport({
      dts: "./src/auto-imports.d.ts",
      imports: ["vue", "pinia", "vue-router", "@vueuse/core"],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      resolvers: [NaiveUiResolver()], //自动按需引入我们在代码中使用到的组件和对应的样式
    }),
    Components({
      dts: "./src/components.d.ts",
      // imports 指定组件所在位置，默认为 src/components
      dirs: ["src/components/"],
      resolvers: [NaiveUiResolver(), VueUseComponentsResolver()], //自动按需引入我们在代码中使用到的组件和对应的样式
    }),
    // ===实现自动按需加载 end===
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
    // 接口代理
    // proxy: {
    //   "/api": {
    //     // 本地 8000 前端代码的接口 代理到 8888 的服务端口
    //     target: "http://localhost:8888/",
    //     changeOrigin: true, // 允许跨域
    //     rewrite: (path) => path.replace("/api/", "/"),
    //   },
    // },
  },
  // 生产环境打包配置
  //去除 console debugger
  build: {
    brotliSize: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 2000,
    // 在生产环境移除console.log
    terserOptions: {
      compress: {
        drop_console: false,
        pure_funcs: ["console.log", "console.info"],
        drop_debugger: true,
      },
    },
    assetsDir: "static/assets",
    // 静态资源打包到dist下的不同目录
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
