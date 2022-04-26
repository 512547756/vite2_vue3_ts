import http from "@/service/http";
import * as T from "./types";

const loginApi: T.ILoginApi = {
  login(params) {
    return http.post("/login", params);
  },
  userInfoRequest() {
    return http.post("/user/info");
  },
};
export default loginApi;
