import { createApp, Directive } from "vue";
import App from "./App.vue";
import router from "./router/index";
import "@/router/permission";
import store from "./store";
import * as directives from "@/directives";

const app = createApp(App);
console.log(directives);

// 自定义指令
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

app.use(router);
app.use(store);

app.mount("#app");
