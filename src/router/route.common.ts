// 不需要鉴权的业务路由
import { RouteRecordRaw } from "vue-router";

const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "test",
    meta: {
      title: "登陆222",
    },
    component: () => import("@/pages/test/index.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登陆",
    },
    component: () => import("@/pages/login/login.vue"), // 注意这里要带上 文件后缀.vue
  },
];

export default commonRoutes;
