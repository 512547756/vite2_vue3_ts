import store from "@/store";
import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
import asyncRoutes from "@/router/route.async";
import commonRoutes from "@/router/route.common";
import exceptionRoutes from "@/router/route.exception";

interface IPermissionState {
  routes: RouteRecordRaw[];
  dynamicRoutes: RouteRecordRaw[];
}

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return route.meta.roles.includes(role);
      }
      return false;
    });
  }
  return true;
};

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const r = { ...route };
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles);
      }
      res.push(r);
    }
  });
  return res;
};

export const usePermissionStore = defineStore({
  id: "permission",
  state: (): IPermissionState => {
    return {
      routes: [],
      dynamicRoutes: [],
    };
  },
  actions: {
    setRoutes(roles: string[]) {
      let accessedRoutes;
      if (roles.includes("admin")) {
        // 如果是admin ,默认最大权限，根据真实生产更换最大管理员的roles角色
        accessedRoutes = asyncRoutes;
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      this.routes = commonRoutes.concat(accessedRoutes).concat(exceptionRoutes);
      this.dynamicRoutes = accessedRoutes.concat(exceptionRoutes);
    },
  },
});

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
