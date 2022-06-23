import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
//@ts-ignore
import viteCompression from "vite-plugin-compression";
// 实现自动按需加载
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ElementPlusResolver,
  VueUseComponentsResolver,
} from "unplugin-vue-components/resolvers"; //插件需要的resolver 包含主流UI https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/naive-ui.ts
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"; // 解决Vue3使用svg

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
      resolvers: [ElementPlusResolver()], //自动按需引入我们在代码中使用到的组件和对应的样式
    }),
    Components({
      dts: "./src/components.d.ts",
      // imports 指定组件所在位置，默认为 src/components
      dirs: ["src/components/"],
      resolvers: [ElementPlusResolver(), VueUseComponentsResolver()], //自动按需引入我们在代码中使用到的组件和对应的样式
    }),
    // ===实现自动按需加载 end===
    /** svg插件 */
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
      symbolId: "icon-[dir]-[name]",
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
    // host 设置为 true 才可以使用 network 的形式，以 ip 访问项目
    host: true, // host: "0.0.0.0"
    // 端口号
    port: 9999,
    // 是否自动打开浏览器
    open: true,
    // 跨域设置允许
    cors: true,
    // 是否开启 https
    https: false,
    // 如果端口已占用，直接退出
    strictPort: true,
    // 接口代理
    // proxy: {
    //   "/api": {
    //     // 本地 9999 前端代码的接口 代理到 8888 的服务端口
    //     target: "http://www.aaa.com",
    //     secure: false, // 忽略证书检查
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
    // vite 2.6.x 以上需要配置 minify: terser，terserOptions 才能生效
    minify: "terser",
    // 在 build 代码时移除 console.log、debugger 和 注释
    terserOptions: {
      compress: {
        drop_console: false,
        pure_funcs: ["console.log", "console.info"],
        drop_debugger: true,
      },
      output: {
        // 删除注释
        comments: false,
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
