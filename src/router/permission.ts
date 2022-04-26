import router from "@/router";
import NProgress from "nprogress";
import { RouteLocationNormalized } from "vue-router";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/cookies";

const userStore = useUserStoreHook();
const permissionStore = usePermissionStoreHook();
NProgress.configure({ showSpinner: false });

/** 动态路由配置 */
interface IAsyncRouteSettings {
  /**
   * 是否开启动态路由功能？
   * 1. 开启后需要后端配合，在查询用户详情接口返回当前用户可以用来判断并加载动态路由的字段（该项目用的是角色 roles 字段）
   * 2. 假如项目不需要根据不同的用户来显示不同的页面，则应该将 open: false
   */
  open: boolean;
  /** 当动态路由功能关闭时：
   * 1. 应该将所有路由都写到常驻路由里面（表明所有登陆的用户能访问的页面都是一样的）
   * 2. 系统自动给当前登录用户赋值一个默认的角色（默认为 admin，拥有所有页面权限）
   */
  defaultRoles: Array<string>;
}

const asyncRouteSettings: IAsyncRouteSettings = {
  open: true,
  defaultRoles: ["admin"],
};

// 首次或者刷新界面
let registerRouteFresh = true;

// 路由前置钩子
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    NProgress.start();
    // 设置页面标题
    document.title =
      (to.meta.title as string) || (import.meta.env.VITE_APP_TITLE as string);
    const title = to.meta && (to.meta.title as string);
    if (title) {
      document.title = title;
    }
    // 判断该用户是否登录
    if (getToken()) {
      if (to.path === "/login") {
        // 如果登录，并准备进入 login 页面，则重定向到主页
        next({ path: "/" });
        NProgress.done();
      } else {
        // 检查用户是否已获得其权限角色
        if (userStore.roles.length === 0) {
          try {
            if (asyncRouteSettings.open) {
              /**  注意：角色必须是一个数组！ 例如: ['admin'] 或 ['developer', 'editor']
              去获取用户的权限并存入pinia ,根据项目修改getInfo中的逻辑
              userStore.getInfo();  */

              const roles = userStore.roles;
              // 根据角色生成可访问的 routes（可访问路由 = 常驻路由 + 有访问权限的动态路由）
              permissionStore.setRoutes(roles);
            } else {
              // 没有开启动态路由功能，则启用默认角色
              userStore.setRoles(asyncRouteSettings.defaultRoles);
              permissionStore.setRoutes(asyncRouteSettings.defaultRoles);
            }

            if (registerRouteFresh) {
              // 将'有访问权限的动态路由' 添加到 router 中
              permissionStore.dynamicRoutes.forEach((route) => {
                router.addRoute(route);
              });
              console.log(router.getRoutes());
              /**  确保添加路由已完成
             设置 replace: true, 因此导航将不会留下历史记录*/
              next({ ...to, replace: true });
              registerRouteFresh = false;
            } else {
              next();
            }
          } catch (err: any) {
            // 过程中发生任何错误，都直接重置 token，并重定向到登录页面
            userStore.resetToken();
            // ElMessage.error(err.message || "路由守卫过程发生错误");
            next({
              name: "login",
            });
            NProgress.done();
          }
        } else {
          next();
        }
      }
    } else if (!getToken() && to.path === "/login") {
      //   // 如果没有Token 并且跳转的页面是登录，直接跳转
      next();
    } else {
      // // 如果没有 token,其他没有访问权限的页面将被重定向到登录页面
      next({
        name: "login",
      });
      NProgress.done();
    }
  }
);

// 路由后置钩子
router.afterEach((to, from) => {
  NProgress.done();
  // console.log(to, "to", from, "from");
});

// 导航守卫
// onBeforeRouteLeave, onBeforeRouteUpdate
