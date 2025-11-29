import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import routes from './routes'
import { useLoadingStore } from '@/stores/loading.store';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由跳转前：显示加载页
router.beforeEach((_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const loadingStore = useLoadingStore();
  loadingStore.setRouteLoading(true);
  next() // 继续跳转
})

// 跳转后：隐藏加载页
router.afterEach(() => {
  const loadingStore = useLoadingStore();
  // 延迟300ms，避免加载页闪一下（快速跳转时）
  setTimeout(() => {
    loadingStore.setRouteLoading(false);
  }, 1500);
})

export default router