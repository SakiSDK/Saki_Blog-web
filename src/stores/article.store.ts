import { defineStore } from "pinia";
import { ArticleAPI } from "../apis/article.api";
import type { ArticleDetail, ArticleDetailResponse, HomeArticle, HomeArticleListQuery, HomeArticleListResponse, LatestArticle, LatestArticleListResponse } from '@/schemas/article.schema';
import { computed, reactive, ref } from 'vue';
import type { Pagination } from '@/schemas/base.schema';
import type { AxiosRequestConfig } from 'axios';



/** ---------- 类型第一 ---------- */
interface BaseResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
}


/** ---------- 常量初始化 ---------- */
/** 初始化分页信息 */
const INIT_PAGINATION: Pagination = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
}
/** 初始化文章响应式数据 */
const INIT_STATE = {
  articleList: [],
  articleDetail: null,
  pagination: { ...INIT_PAGINATION },
  isLoading: false,
  isReloading: false,
  errorMsg: null,
  errorCode: null

}


/** ---------- 辅助函数 ---------- */
/**
 * 格式化分页参数（确保合法，避免异常值）
 */
const formatPageQuery = (
  params: Partial<HomeArticleListQuery>,
  isRefresh: boolean
) => {
  const defaultPage = { page: 1, pageSize: 10 };
  if (isRefresh) return defaultPage;
  return {
    ...params,
    page: Math.max(params.page || defaultPage.page, 1),
    pageSize: Math.max(params.pageSize || defaultPage.pageSize, 1),
  };
};

/** 
 * 通用错误处理：生成兜底响应 + 记录错误信息
 * @param error 捕获的错误对象
 * @param key 错误信息键名
 * @returns 兜底响应对象
*/
const handleRequestError = <T extends BaseResponse<any>>(
  error: unknown,
  defaultMsg: string,
  defaultCode = 500
): T => {
  const message = (error instanceof Error ? error.message : String(error)) || defaultMsg;
  console.error(`❌ ${defaultMsg}：`, error);
  return {
    success: false,
    code: defaultCode,
    message,
    data: null,
  } as T;
};


export const useArticleStore = defineStore('article', () => {
  /** 文章列表表 */
  const articleListMap = reactive<{
    home: HomeArticle[],
    latest: LatestArticle[],
  }>({
    home: INIT_STATE.articleList as HomeArticle[],
    latest: INIT_STATE.articleList as LatestArticle[],
  })
  /** 分页表 */
  const paginationMap = reactive<Record<string, Pagination>>({
    home: { ...INIT_STATE.pagination }
  });
  /** 加载状态表 */
  const loadingMap = reactive<Record<string, boolean>>({
    home: INIT_STATE.isLoading,
    latest: INIT_STATE.isLoading,
    detail: INIT_STATE.isLoading,
  });
  /** 错误表 */
  const errorMap = reactive<Record<string, { msg: string | null, code: number | null }>>({
    home: { msg: null, code: null },
    latest: { msg: null, code: null },
    detail: { msg: null, code: null }
  });
  /** 当前请求参数 */
  const currentQuery = ref<any>(null);
  /** 文章详情 */
  const articleDetail = ref<ArticleDetail | null>(null)


  /** ---------- 计算属性 ---------- */
  /** 
   * 文章列表计算属性工厂
   * @param key 文章列表键名
   * @returns 文章列表计算属性对象
   */
  const useArticleListComputed = <K extends keyof typeof articleListMap>(key: K) => {
    /** 当前文章列表 */
    const articleList = computed(() => articleListMap[key] ?? (INIT_STATE.articleList as typeof articleListMap[K]));
    return {
      articleList
    }
  }
  /** 
   * 分页信息计算属性工厂
   * @param key 分页信息键名
   * @returns 分页信息计算属性对象
   */
  const usePaginationComputed = (key: keyof typeof paginationMap) => {
    /** 当前分页信息 */
    // 注意：虽然可以直接修改 pagination.value 的属性来更新 paginationMap，但建议使用 setPagination 方法
    const pagination = computed<Pagination>(() => paginationMap[key] ?? { ...INIT_STATE.pagination });
    /** 是否有下一页 */
    const hasNextPage = computed<boolean>(() => pagination.value.hasNext ?? false);
    /** 是否有上一页 */
    const hasPrevPage = computed<boolean>(() => pagination.value.hasPrev ?? false);

    return {
      pagination,
      hasNextPage,
      hasPrevPage
    }
  }

  /** 
   * 设置分页信息（推荐使用此方法修改分页）
   * @param key 分页信息键名
   * @param newPagination 新的分页信息
   */
  const setPagination = (key: keyof typeof paginationMap, newPagination: Partial<Pagination>) => {
    if (!paginationMap[key]) {
      paginationMap[key] = { ...INIT_STATE.pagination };
    }
    Object.assign(paginationMap[key], newPagination);
  }
  /** 
   * 加载状态计算属性工厂
   * @param key 加载状态键名
   * @returns 加载状态计算属性对象
   */
  const useLoadingComputed = (key: keyof typeof loadingMap) => {
    /** 当前加载状态 */
    const isLoading = computed<boolean>(() => loadingMap[key] ?? INIT_STATE.isLoading);
    return {
      isLoading
    }
  }
  /** 
   * 错误信息计算属性工厂
   * @param key 错误信息键名
   * @returns 错误信息计算属性对象
   */
  const useErrorComputed = (key: keyof typeof errorMap) => {
    /** 当前错误信息 */
    const errorMsg = computed<string | null>(() => errorMap[key]?.msg ?? INIT_STATE.errorMsg);
    const errorCode = computed<number | null>(() => errorMap[key]?.code ?? INIT_STATE.errorCode);

    return {
      errorMsg,
      errorCode
    }
  }



  /** ---------- 辅助函数 ---------- */
  /** 
   * 更新列表加在状态（延迟关闭，避免闪烁）
   * @param key 加载状态键名
   * @param value 新的加载状态值
   */
  const updateLoadingState = (key: keyof typeof loadingMap, value: boolean) => {
    loadingMap[key] = value;
    setTimeout(() => {
      loadingMap[key] = false;
    }, 300);
  }
  /** 
   * 重置初始化错误信息
   * @param key 错误信息键名
   */
  const resetInitError = (key: keyof typeof errorMap) => {
    errorMap[key] = { msg: null, code: null };
  }


  /** ---------- 核心函数方法 ---------- */
  /** 
   * 获取首页文章列表
   * @param query 请求参数
   */
  const getHomeArticleList = async (
    query?: HomeArticleListQuery,
    isRefresh?: boolean,
    config?: AxiosRequestConfig
  ): Promise<HomeArticleListResponse> => {
    updateLoadingState('home', true);
    resetInitError('home');

    try {
      /** 是否使用缓存 */
      const shouldUseCache = !isRefresh && articleListMap['home'] && articleListMap['home'].length > 0;
      if (shouldUseCache) {
        updateLoadingState('home', false);
        return {
          success: true,
          code: 200,
          message: 'success',
          data: {
            list: articleListMap['home'],
            pagination: paginationMap['home']
          }
        } as HomeArticleListResponse;
      }

      /** 格式化分页参数 */
      const pageQuery = formatPageQuery(query || {}, false);
      currentQuery.value = {
        ...pageQuery,
        ...currentQuery.value
      };

      // 发送请求
      const res = await ArticleAPI.getHomeArticleList(currentQuery.value, config);
      if (res.success) {
        articleListMap['home'] = res.data?.list || INIT_STATE.articleList;
        paginationMap['home'] = res.data?.pagination || { ...INIT_STATE.pagination };
      } else {
        // 记录错误信息
        errorMap['home'] = {
          msg: res.message || '获取文章列表失败',
          code: res.code || -1
        };
      }
      return res as HomeArticleListResponse;
    } catch (error: any) {
      // 捕获异常并记录错误
      errorMap['home'] = {
        msg: error.message || '网络异常，请稍后重试',
        code: error.code || -1
      };
      // 返回统一的错误响应格式
      return handleRequestError(error, '获取文章列表失败') as HomeArticleListResponse;
    } finally {
      // 无论成功或失败都关闭加载状态
      updateLoadingState('home', false);
    }
  }
  /** 
   * 获取文章详情
   * @param shortId 文章短ID
   */
  const getArticleDetail = async (
    shortId: string,
    config?: AxiosRequestConfig
  ): Promise<ArticleDetailResponse> => {
    updateLoadingState('detail', true);
    resetInitError('detail');

    try {
      // 发送请求
      const res = await ArticleAPI.getArticleDetail(shortId, config);
      if (res.success) {
        articleDetail.value = res.data || INIT_STATE.articleDetail;
      } else {
        // 记录错误信息
        errorMap['detail'] = {
          msg: res.message || '获取文章详情失败',
          code: res.code || -1
        };
      }
      return res as ArticleDetailResponse;
    } catch (error: any) {
      // 捕获异常并记录错误
      errorMap['detail'] = {
        msg: error.message || '网络异常，请稍后重试',
        code: error.code || -1
      };
      // 返回统一的错误响应格式
      return handleRequestError(error, '获取文章详情失败') as ArticleDetailResponse;
    } finally {
      // 无论成功或失败都关闭加载状态
      updateLoadingState('detail', false);
    }
  }
  /** 
    * 获取最新文章列表
    */
  const getLatestArticles = async (
    config?: AxiosRequestConfig,
  ): Promise<LatestArticleListResponse> => {
    updateLoadingState('latest', true);
    resetInitError('latest');
    try {
      // 发送请求
      const res = await ArticleAPI.getLatestArticle(config);
      if (res.success) {
        articleListMap['latest'] = res.data?.list || INIT_STATE.articleList;
      } else {
        // 记录错误信息
        errorMap['latest'] = {
          msg: res.message || '获取最新文章列表失败',
          code: res.code || -1
        };
      }
      return res as LatestArticleListResponse;
    } catch (error: any) {
      // 捕获异常并记录错误
      errorMap['latest'] = {
        msg: error.message || '网络异常，请稍后重试',
        code: error.code || -1
      };
      // 返回统一的错误响应格式
      return handleRequestError(error, '获取最新文章列表失败') as LatestArticleListResponse;
    } finally {
      // 无论成功或失败都关闭加载状态
      updateLoadingState('latest', false);
    }
  }

  return {
    // 计算属性
    useArticleListComputed,
    usePaginationComputed,
    useLoadingComputed,
    useErrorComputed,

    // 数据
    articleDetail,
    articleListMap,
    paginationMap,
    loadingMap,
    errorMap,
    currentQuery,
    
    // 方法
    getHomeArticleList,
    setPagination,
    getArticleDetail,
    getLatestArticles
  }
})