import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
// import exceptionRoutes from "@/router/route.exception";
// import asyncRoutes from "@/router/route.async";
import commonRoutes from "@/router/route.common";

const routes: Array<RouteRecordRaw> = [
  // 无鉴权的业务路由 ex:登录
  ...commonRoutes,
  // 带鉴权的业务路由
  // ...asyncRoutes,
  // 异常页必须放在路由匹配规则的最后
  // ...exceptionRoutes,
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE as any),
  routes,
});

export default router;

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route;
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch (error) {
    // 强制刷新浏览器，不过体验不是很好
    window.location.reload();
  }
}
