import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import routes from './routes'
import { useLoadingStore } from '@/stores/loading.store';
import { useTagStore } from './../stores/tag.store';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 优化用户体验，记录前进/回退的滚动位置
  scrollBehavior(to, _, savedPosition) {
    // 前进/后退：Vue Router 自带的 savedPosition
    if (savedPosition) {
      return savedPosition
    }

    // 你可以自行记录滚动位置（如果你需要增强行为）
    const key = to.fullPath
    const saved = sessionStorage.getItem(`scroll:${key}`)

    if (saved) {
      const pos = JSON.parse(saved)
      return {
        left: pos.left,
        top: pos.top,
        behavior: 'auto'
      }
    }

    //默认行为：没有记录时返回顶部
    return { left: 0, top: 0 }
  }
})

// 路由跳转前：显示加载页
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const loadingStore = useLoadingStore();
  if (to.name !== 'login') {
    loadingStore.setRouteLoading(true);
  }
  const tagStore = useTagStore();
  tagStore.isPageReloaded = false;
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