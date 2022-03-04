// 不需要鉴权的业务路由
import { RouteRecordRaw } from "vue-router";

const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    meta: {
      title: "登陆",
    },
    component: () => import("@/pages/login/login.vue"), // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/test",
    name: "test",
    meta: {
      title: "测试",
    },
    component: () => import("@/pages/test/index.vue"), // 注意这里要带上 文件后缀.vue
  },
];

export default commonRoutes;
