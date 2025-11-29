<script setup lang="ts">
import { onMounted } from 'vue';
import { useLoadingStore } from './stores/loading.store';
import GlobalLoader from './views/GlobalLoader.vue';
import { useEventListener } from '@vueuse/core';


const loadingStore = useLoadingStore();
const handleHideLoader = () => {
  // 先让加载页透明（过渡效果），再隐藏
  const loader = document.querySelector('.global-loader') as HTMLElement;
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loadingStore.setGlobalLoading(false);
    }, 300); // 对应 CSS transition 时长
  }
}


onMounted(() => {
  // DOM加载完成（无需等待图片加载）
  useEventListener('DOMContentLoaded', () => {
    handleHideLoader()
  });
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
