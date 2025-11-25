import type { Router, RouteLocationRaw } from 'vue-router';


/**
 * 路由工具类
 * @example
 * // 在 main.ts 中初始化
 * const routerUtil = new RouterUtils(router)
 * 
 * // 在组件中使用
 * routerUtil.push('/home', { query: 'test' })
 */
export class RouterUtil {
  private router: Router | null = null;
  private whiteList: string[] = ['/login', '/register', '/forgot-password', '/reset-password'];
  private defaultRoute: string = '/'

  init(router: Router) {
    this.router = router;

  }

  /**
   * 设置导航守卫
   */
  private setupNavigationGuard() {
    if (!this.router) return;
    
    // 全局前置守卫
    this.router.beforeEach(async (to, from, next) => { 
      
    });

    // 全局解析守卫
    this.router.beforeResolve(async (to, from, next) => {
      
    });

    // 全局后置钩子
    this.router.afterEach(async (to, from) => {
      
    });
  }
  
}