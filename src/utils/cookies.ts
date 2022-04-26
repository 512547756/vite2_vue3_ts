import Cookies from "js-cookie";

class Keys {
  static token = "token-key";
}
export const getToken = () => Cookies.get(import.meta.env.VITE_APP_TOKEN_KEY);
export const setToken = (token: string) =>
  Cookies.set(import.meta.env.VITE_APP_TOKEN_KEY);
export const removeToken = () =>
  Cookies.remove(import.meta.env.VITE_APP_TOKEN_KEY);
