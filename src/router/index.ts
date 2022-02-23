import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/pages/login/Login.vue"), // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("@/pages/test/index.vue"), // 注意这里要带上 文件后缀.vue
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由前置钩子
router.beforeEach((to, from, next) => {
  const title = to.meta && (to.meta.title as string);
  if (title) {
    document.title = title;
  }
  next();
});

// 路由后置钩子
router.afterEach((to, from) => {
  console.log(to, "to", from, "from");
});

// 导航守卫
// onBeforeRouteLeave, onBeforeRouteUpdate

export default router;
