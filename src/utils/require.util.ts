import { useUserStore } from './../stores/useUserStore';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showMessage } from './message'
import { AuthApi } from '@/api/AuthApi';
import { useAppRouter } from './useAppRouter';
import { useToken } from './useToken';

const { goTo } = useAppRouter()

// token相关方法
const { getToken, setToken, clearToken, isExpired } = useToken()

//1. 创建axios实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 统一前缀
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
})

// Token刷新相关变量
let isRefreshing = false; // 是否正在刷新Token
let requestQueue: Array<(token: string) => void> = [] // 待重试请求队列

// 刷新Token并重试请求，用于无感刷新
const refreshToken = async (): Promise<string> => { 
    // 调用后端刷新接口（假设refreshToken在cookie中，无需手动传入）
    const res = await AuthApi.refreshToken()

    const { accessToken: newToken, expiresIn } = res.data;

    const oldToken = getToken();

    // 跟下localStorage中对的token
    if (newToken === oldToken) {
        console.warn('Token未改变，请勿重复刷新')
    }

    // 刷新Token和过期时间
    setToken(newToken, expiresIn)

    return newToken
}

//2. 请求拦截器
service.interceptors.request.use(
    async config => { 
        const token = getToken();
        if (token && config.headers) {
            // 检测Token是否过期
            if (isExpired()) {
                // 检测是否正在刷新Token
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const newToken = await refreshToken();

                        // 刷新成功
                        requestQueue.forEach(callback => callback(newToken))
                        isRefreshing = false;
                        requestQueue = []

                        config.headers.Authorization = `Bearer ${newToken}`
                        return Promise.resolve(config)
                    } catch (error) {
                        isRefreshing = false;
                        // 刷新Token失败，清除Token以及用户信息并跳转到登录页
                        const userStore = useUserStore();
                        userStore.clearUserInfo();

                        // 清除Token
                        clearToken()

                        // 跳转到登录页
                        goTo('/login');

                        showMessage('登录已过期，请重新登录', 'error')
                        return Promise.reject(error)
                    }
                } else {
                    return new Promise(resolve => {
                        requestQueue.push(newToken => {
                            config.headers.Authorization = `Bearer ${newToken}`
                            resolve(config)
                        })
                    })
                }
            }
            // token 有效，正常附带请求头
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: any) => {
        return Promise.reject(error)
    }
)

//3. 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        if (response.status<200 || response.status>=300) {
            console.error(res.message || '请求出错')
            return Promise.reject(res)
        }
        return res // 直接返回业务数据
    },
    async (error: any) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
        
        // 处理401错误（Token过期）
        if (error.response?.status === 401) {
            // 避免无限重试
            if (!originalRequest._retry) {
                originalRequest._retry = true
            } else {
                showMessage('登录已过期，请重新登录', 'error')
                return Promise.reject(error.response.data||error.message||error)
            }
            
            if (!isRefreshing) {
                // 首次触发：开始刷新Token
                isRefreshing = true
                try {
                    const newToken = await refreshToken()
                    // 重试队列中的请求
                    requestQueue.forEach(callback => callback(newToken))
                    requestQueue = []
                    // 重试当前请求
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return service(originalRequest)
                } catch (error) {
                    return Promise.reject(error.response.data||error.message||error)
                } finally {
                    isRefreshing = false;
                }
            } else {
                // 正在刷新中：加入队列等待
                return new Promise(resolve => {
                    requestQueue.push(newToken => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        resolve(service(originalRequest))
                    })
                })
            }
        }

        // 其他错误（如404、500）
        const errorMsg = error.response?.data?.message || error.message || '请求出错';
        showMessage(errorMsg, 'error')
        return Promise.reject(error.response.data||error.message||error)
    }
)

export const get = async <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res = await service.get<T>(url, {
        params,
        ...config
    })
    return res as T
}

export const post = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res = await service.post<T>(url, data, config)
    return res as T
}
export const put = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res = await service.put<T>(url, data, config)
    return res as T
}

export const del = async <T = any>(url: string, parmas?: object, config?: AxiosRequestConfig): Promise<T> => {
    const res = await service.delete<T>(url, {
        params: parmas,
        ...config,
    })
    return res as T
}

export default service