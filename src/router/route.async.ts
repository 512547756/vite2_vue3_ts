// 需要鉴权的业务路由
import { RouteRecordRaw } from "vue-router";

const asyncRoutes: Array<RouteRecordRaw> = [
  // {
  //     path: "/test",
  //     component: () => import("@/pages/test/index.vue"),
  //     name: "test",
  //     meta: {
  //       title: "测试",
  //       icon: "lock",
  //       roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     }
  //     // children: [
  //       // {
  //       //   path: "page",
  //       //   component: () => import("@/views/permission/page.vue"),
  //       //   name: "PagePermission",
  //       //   meta: {
  //       //     title: "页面权限",
  //       //     roles: ["admin"] // 或者在子导航中设置角色
  //       //   }
  //       // },
  //     // ]
  //   },
];

export default asyncRoutes;
