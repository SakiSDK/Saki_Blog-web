<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLoadingStore } from './stores/loading.store';
import GlobalLoader from './views/GlobalLoader.vue';
import { useEventListener } from '@vueuse/core';
import { waitForAllRequests } from './utils/apiTracker.util';


const loadingStore = useLoadingStore();
const domReady = ref(false); // 标记 DOM 是否加载完成

// 原有隐藏加载页逻辑（保留）
const handleHideLoader = () => {
  setTimeout(() => {
    loadingStore.setGlobalLoading(false);
  }, 300); // 对应 CSS transition 时长
}

// 1. 应用启动时：开启全局加载页
onMounted(() => {
  loadingStore.setGlobalLoading(true); // 初始化显示全局加载
});

// 2. 监听 DOM 加载完成
useEventListener('DOMContentLoaded', () => {
  domReady.value = true;
  checkAllReady(); // 检查是否可以隐藏全局加载
});

// 3. 等待所有初始化接口完成（配合 apiTracker.util.ts）
const waitForApis = async () => {
  await waitForAllRequests(); // 自动等待所有跟踪的接口
  checkAllReady();
};

// 4. 检查：DOM + 接口 都完成 → 隐藏全局加载页
const checkAllReady = () => {
  if (domReady.value) {
    handleHideLoader();
  }
};

// 5. 页面挂载后，启动接口等待
onMounted(() => {
  waitForApis();
});
</script>

<template>
<div class="app">

  <!-- 全局初始化加载页 -->
  <Transition name="loading-fade">
    <GlobalLoader 
      v-if="loadingStore.isGlobalLoading" 
    />
  </Transition>
  <!-- 路由切换加载页（复用组件，仅修改文本） -->
  <Transition name="loading-fade">
    <GlobalLoader 
      v-if="loadingStore.isRouteLoading"
    />
  </Transition>
  <router-view/>
</div>
</template>

<style lang="scss" scoped>

</style>
