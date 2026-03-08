<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLoadingStore } from './stores/loading.store';
import GlobalLoader from './views/GlobalLoader.vue';
import { useEventListener } from '@vueuse/core';
import { waitForAllRequests } from './utils/apiTracker.util';
import CustomScrollbar from '@/components/global/CustomScrollbar.vue';
import ContextMenu from '@/components/global/ContextMenu.vue';


const loadingStore = useLoadingStore();
// 立即开启加载状态，避免页面刷新时出现内容闪烁
loadingStore.setGlobalLoading(true);

const domReady = ref(false); // 标记 DOM 是否加载完成
const apiReady = ref(false); // 标记 API 是否加载完成

// 原有隐藏加载页逻辑（保留）
const handleHideLoader = () => {
  setTimeout(() => {
    loadingStore.setGlobalLoading(false);
  }, 300); // 对应 CSS transition 时长
}

// 2. 监听 DOM 加载完成
useEventListener('DOMContentLoaded', () => {
  domReady.value = true;
  checkAllReady(); // 检查是否可以隐藏全局加载
});
// 补救措施：如果事件已错过，手动标记
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  domReady.value = true;
}

// 3. 等待所有初始化接口完成（配合 apiTracker.util.ts）
const waitForApis = async () => {
  await waitForAllRequests(); // 自动等待所有跟踪的接口
  apiReady.value = true;
  checkAllReady();
};

// 4. 检查：DOM + 接口 都完成 → 隐藏全局加载页
const checkAllReady = () => {
  if (domReady.value && apiReady.value) {
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
  <div v-show="!loadingStore.isGlobalLoading">
    <CustomScrollbar />
    <ContextMenu />
    <router-view/>
  </div>
</div>
</template>

<style lang="scss" scoped>

</style>
