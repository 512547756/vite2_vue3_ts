import store from "@/store";
import { defineStore } from "pinia";
import { usePermissionStore } from "./permission";
import { getToken, removeToken, setToken } from "@/utils/cookies";
import router, { resetRouter } from "@/router";
import loginApi from "@/service/api/login/login";
import { RouteRecordRaw } from "vue-router";

interface IUserState {
  token: string;
  roles: string[];
}

export const useUserStore = defineStore({
  id: "user",
  state: (): IUserState => {
    return {
      token: getToken() || "",
      roles: [],
    };
  },
  actions: {
    /** 设置角色数组 */
    setRoles(roles: string[]) {
      this.roles = roles;
    },
    /** 登录 */
    async login(userInfo: { username: string; password: string | number }) {
      const res = await loginApi.login({
        userName: userInfo.username.trim(),
        passWord: userInfo.password,
      });
      setToken(res.data.accessToken);
      this.token = res.data.accessToken;
    },
    /** 获取用户详情 */
    async getInfo() {
      const res = await loginApi.userInfoRequest();
      this.roles = res.data.user.roles;
    },
    /** 登出 */
    logout() {
      removeToken();
      this.token = "";
      this.roles = [];
      resetRouter();
    },
    /** 重置 token */
    resetToken() {
      removeToken();
      this.token = "";
      this.roles = [];
    },
  },
  getters: {},
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store);
}
