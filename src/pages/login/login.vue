<template>
  <div>用户名:{{ mainStore.name }}<br />长度:{{ mainStore.nameLength }}</div>
  <hr />
  <n-button @click="updateName">修改12store中的name</n-button>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { NButton } from "naive-ui";

const mainStore = useMainStore();

console.log(import.meta.env.VITE_APP_WEB_URL);

const updateName = () => {
  // $patch 修改 store 中的数据
  mainStore.$patch({
    name: "名称被修改了,nameLength也随之改变了",
  });
};
</script>
