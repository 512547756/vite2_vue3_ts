<template>
  <div>12322422666</div>
  <div @click="toSomeUri">123</div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, useRouter } from "vue-router";
const router = useRouter();
onBeforeRouteLeave((to, from, next) => {
  console.log(to, from);
  next();
});
const toSomeUri = () => {
  router.push("222").catch((err) => {
    console.warn(err);
  });
};
// import mySocket from "@/service/mySocket";

// const wss = new mySocket({
//   url: "ws://127.0.0.1:1200",
//   sendData: {
//     type: "successHello",
//     data: { msg: "hello" },
//   },
// });
</script>
