import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
import exceptionRoutes from "@/router/route.exception";
import asyncRoutes from "@/router/route.async";
import commonRoutes from "@/router/route.common";
import NProgress from "nprogress";

const routes: Array<RouteRecordRaw> = [
  // 无鉴权的业务路由 ex:登录
  ...commonRoutes,
  // 带鉴权的业务路由
  ...asyncRoutes,
  // 异常页必须放在路由匹配规则的最后
  ...exceptionRoutes,
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE as any),
  routes,
});

// 路由前置钩子
router.beforeEach((to, from, next) => {
  console.log("全局路由前置守卫：to,from\n", to, from);
  // 设置页面标题
  document.title =
    (to.meta.title as string) || (import.meta.env.VITE_APP_TITLE as string);

  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  const title = to.meta && (to.meta.title as string);
  if (title) {
    document.title = title;
  }
  next();
});

// 路由后置钩子
router.afterEach((to, from) => {
  NProgress.done();
  console.log(to, "to", from, "from");
});

// 导航守卫
// onBeforeRouteLeave, onBeforeRouteUpdate

export default router;
