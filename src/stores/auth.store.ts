import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { TokenPair, TokenPayload, User } from '@/types/stores/AuthStore';
import { AuthApi } from '@/apis/auth.api';


export const useAuthStore = defineStore('auth', () => { 
  /** ---------- Auth State ---------- */
  const user = ref<User | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastActivity = ref<number>(Date.now())

  /** ---------- Token State ---------- */
  const accessToken = useStorage('access_token', null as string | null)
  const refreshToken = useStorage('refresh_token', null as string | null)
  const expiresAt = useStorage('expires_at', null as number | null)
  const tokenType = ref<string>('Bearer')
  const isRefreshing = ref<boolean>(false)
  const refreshPromise = ref<Promise<string> | null>(null)
  const lastRefreshAttempt = ref<number>(0)
  const refreshRetryCount = ref<number>(0)

  /** ---------- Computed Getter ---------- */
  // Auth Getters
  /** 授权状态 */
  const isAuthenticated = computed(() => {
    return !!user.value && !!accessToken.value && !isTokenExpired.value
  })
  /** 管理员状态 */
  const isAdmin = computed(() => {
    return user.value && user.value.role === 'admin'
  })
  /**  */
  const hasPermission = computed(() => (permission: string) => {
    return user.value?.permissions?.includes(permission) || isAdmin.value
  })
  /**  */
  const hasAnyPermission = computed(() => (permissionList: string[]) =>
    permissionList.some(permission => hasPermission.value(permission))
  )

  // Token Getters
  /** token 是否过期 */
  const isTokenExpired = computed(() => {
    if (!expiresAt.value) return true;
    return Date.now() >= (expiresAt.value - 30000); // 30秒缓冲
  })
  /** token 是否即将过期 */
  const isTokenAboutToExpire = computed(() => {
    if (!expiresAt.value) return true
    return Date.now() >= (expiresAt.value - 5 * 60 * 1000) // 5分钟前
  })
  /**  */
  const timeUntilExpiry = computed(() => {
    if (!expiresAt.value) return 0
    return Math.max(0, expiresAt.value - Date.now())
  })
  /**  */
  const tokenPayload = computed((): TokenPayload | null => {
    if (!accessToken.value) return null
    try {
      const payload = accessToken.value.split('.')[1]
      if (!payload) return null
      return JSON.parse(atob(payload))
    } catch (error) {
      return null;
    }
  })
  /**  */
  const authorizationHeader = computed(() => {
    if (!accessToken.value) return null;
    return `${tokenType.value} ${accessToken.value}`;
  })

  /** ---------- Token Management ---------- */
  /**
   * 设置token对，并更新用户状态
   */
  const setTokens = async (tokenPair: TokenPair) => { 
    accessToken.value = tokenPair.accessToken;
    expiresAt.value = Date.now() + (tokenPair.expiresIn * 1000);
    tokenType.value = tokenPair.tokenType || 'Bearer';

    // 重置刷新状态
    refreshRetryCount.value = 0;
    lastRefreshAttempt.value = Date.now();

    // 从 token 中提取用户信息
    await extractUserFromToken();
  }

  /**
   * 从token中提取用户信息
   */
  const extractUserFromToken = async () => { 
    if (!tokenPayload.value) return;
    
    try {
      // 如果有用户短ID，可以调用API获取完整用户信息
      if (tokenPayload.value.sub) {
        const userData = await AuthApi.getUserProfile(tokenPayload.value.sub);
        if (userData) {
          user.value = userData;
        }
      } else {
        // 或者直接从 token payload 创建基础用户信息
        user.value = {
          shortId: tokenPayload.value.sub || '',
          email: tokenPayload.value.email || '',
          nickname: tokenPayload.value.nickname || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          permissions: tokenPayload.value.permissions || [],
          gender: tokenPayload.value.gender || '',
          role: tokenPayload.value.role || '',
          avatar: tokenPayload.value.avatar || '',
        }
      }
    } catch (error) {
      console.warn('从Token中提取用户信息失败')
    }
  }
  /**
    * 刷新AccessToken
    */
  const refreshAccessToken = async (): Promise<boolean> => {
    // 防止重复刷新
    if (isRefreshing.value && refreshPromise.value) {
      await refreshPromise.value
      return true
    }

    if (refreshRetryCount.value >= 3) {
      clearAuthState()
      throw new Error('刷新令牌重试次数过多')
    }

    // 检查刷新间隔
    const now = Date.now()
    if (now - lastRefreshAttempt.value < 5000) {
      throw new Error('刷新过于频繁')
    }

    isRefreshing.value = true
    lastRefreshAttempt.value = now
    refreshRetryCount.value++

    try {
      refreshPromise.value = performTokenRefresh()
      await refreshPromise.value
      return true
    } catch (error) {
      console.error('刷新令牌失败:', error)
      // 刷新失败，清除认证状态
      if (refreshRetryCount.value >= 3) {
        clearAuthState()
      }
      throw error
    } finally {
      isRefreshing.value = false
      refreshPromise.value = null
    }
  }

  /**
  * 执行 Token 刷新请求
  */
  const performTokenRefresh = async (): Promise<string> => {
    try {
      const response = await AuthApi.refreshToken()
      
      if (response.success && response.data) {
        const { accessToken: newAccessToken, expiresIn } = response.data
        
        // 更新 access token
        accessToken.value = newAccessToken
        expiresAt.value = Date.now() + (expiresIn * 1000)
        
        // 重置重试计数
        refreshRetryCount.value = 0
        
        return newAccessToken
      } else {
        throw new Error(response.message || '令牌刷新失败')
      }
    } catch (err: any) {
      throw new Error(err.message || '刷新令牌时发生错误')
    }
  }

  /**
   * 清除所有认证状态
   */
  const clearAuthState = () => {
    user.value = null
    accessToken.value = null
    expiresAt.value = null
    error.value = null
    isLoading.value = false
    isRefreshing.value = false
    refreshPromise.value = null
    refreshRetryCount.value = 0
  }

  /** ---------- Auth Actions ---------- */
  /**
   * 用户登录
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await AuthApi.login(credentials)
      
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data
        
        // 设置 tokens（只设置 accessToken，refreshToken 通过 Cookie 管理）
        await setTokens(tokens)
        
        // 设置用户信息（如果API返回了完整的用户信息）
        if (userData) {
          user.value = userData
        }

        // 设置 token 到 API 客户端
        AuthApi.setAccessToken(tokens.accessToken)

        return { success: true }
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (err: any) {
      error.value = err.message || '登录过程中发生错误'
      clearAuthState()
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }
  /**
   * 用户注册
   */
  const register = async (userData: RegisterData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await AuthApi.register(userData)
      
      if (response.success) {
        // 注册成功后自动登录
        return await login({
          email: userData.email,
          password: userData.password
        })
      } else {
        throw new Error(response.message || '注册失败')
      }
    } catch (err: any) {
      error.value = err.message || '注册过程中发生错误'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户注销
   * 需要调用后端注销接口来清除 HttpOnly Cookie
   */
  const logout = async (silent = false) => {
    try {
      // 调用后端注销接口，清除 HttpOnly Cookie
      await AuthApi.logout()
    } catch (err) {
      console.warn('注销时发生错误:', err)
    } finally {
      clearAuthState()
      AuthApi.clearAccessToken()
      
      if (!silent) {
        // 跳转到登录页
        const router = useRouter()
        router.push('/login')
      }
    }
  }

  /**
   * 检查认证状态
   */
  const checkAuth = async (): Promise<boolean> => {
    if (!accessToken.value) {
      return false
    }

    // 检查 token 是否过期
    if (isTokenExpired.value) {
      // 尝试刷新 token（refreshToken 通过 Cookie 自动发送）
      try {
        return await refreshAccessToken()
      } catch {
        return false
      }
    }

    // 检查 token 是否即将过期，提前刷新
    if (isTokenAboutToExpire.value) {
      try {
        await refreshAccessToken()
      } catch (error) {
        console.warn('预刷新令牌失败:', error)
      }
    }

    // 验证用户信息
    if (!user.value && tokenPayload.value?.sub) {
      try {
        const userData = await AuthApi.getUserProfile(tokenPayload.value.sub)
        if (userData) {
          user.value = userData
          return true
        }
      } catch (error) {
        console.warn('获取用户信息失败:', error)
      }
    }

    return !!user.value
  }

  /**
   * 初始化认证状态
   */
  const initialize = async () => {
    // 从存储中恢复 accessToken
    if (accessToken.value && expiresAt.value) {
      // 检查 token 状态
      await checkAuth()
    }

    // 设置自动刷新
    startAutoRefresh()
    
    // 设置活动跟踪
    setupActivityTracking()
  }

  // ========== Auto Refresh & Active Tracking ==========
  
  let refreshInterval: number | null = null

  const startAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }

    // 每分钟检查一次 token 状态
    refreshInterval = setInterval(async () => {
      if (isAuthenticated.value) {
        await checkAuth()
      }
    }, 60 * 1000) as unknown as number
  }

  const setupActivityTracking = () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const updateActivity = () => {
      lastActivity.value = Date.now()
    }

    const throttledUpdate = throttle(updateActivity, 30000)

    events.forEach(event => {
      document.addEventListener(event, throttledUpdate, { passive: true })
    })
  }

  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // ========== WATCHERS ==========
  
  // 监听 token 变化，自动设置到 API 客户端
  watch(accessToken, (newToken) => {
    if (newToken) {
      AuthApi.setAccessToken(newToken)
    } else {
      AuthApi.clearAccessToken()
    }
  })

  /** ---------- 导出 ---------- */
  return {
    // State
    user,
    isLoading,
    error,
    lastActivity,
    accessToken,
    expiresAt,
    isRefreshing,

    // Auth Getters
    isAuthenticated,
    isAdmin,
    hasPermission,
    hasAnyPermission,

    // Token Getters
    isTokenExpired,
    isTokenAboutToExpire,
    timeUntilExpiry,
    tokenPayload,
    authorizationHeader,

    // Actions
    login,
    register,
    logout,
    checkAuth,
    initialize,
    refreshAccessToken,
    clearAuthState,
    setTokens
  }
});