import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CategoryAPI } from '@/apis/category.api'
import type { CategoryListParams, CategoryListResponse, Category, Pagination } from '@/schemas/category.schema'; 
import type { AxiosRequestConfig } from 'axios';
import { ErrorResponseSchema, type ErrorResponse } from '@/schemas/base.schema';


export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref<Category[]>([])
  const pagination = ref<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const isLoading = ref(false)
  const errorMsg = ref<string | null>(null)
  const currentParams = ref<CategoryListParams>({
    page: 1,
    pageSize: 10,
    keyword: ''
  })
  const errorCode = ref<number | null>(null);
  const isSuccessful = ref<boolean>(false);


  /** ---------- 计算属性 ---------- */
  const getCategoryTotal = computed(() => pagination.value.total)
  const hasNextPage = computed(() => pagination.value.hasNext)
  const hasPrevPage = computed(() => pagination.value.hasPrev)
  const getCategoryById = computed(() => (id: number) => categoryList.value.find(category => category.id === id))
  const getCategorysByName = computed(() => (name: string) => categoryList.value.filter(category => category.name.includes(name)))
  const getHotCategorys = computed(() => {
    // 深拷贝
    return [...categoryList.value].sort((a: Category, b: Category) => {
      // 处理 postCount 可能为 undefined/null 的情况，默认视为 0
      const countA = a.postCount ?? 0;
      const countB = b.postCount ?? 0;
      // 降序排序（count 大的在前）
      return countB - countA;
    }).slice(0, 10);
  })

  /** ---------- 方法 ---------- */
  const resetState = () => { 
    categoryList.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    };
    errorMsg.value = null
    errorCode.value = null
  }

  const fetchCategoryList = async (
    params?: CategoryListParams,
    isRefresh: boolean = false,
    config?: AxiosRequestConfig
  ): Promise<CategoryListResponse> => { 
    isLoading.value = true
    errorMsg.value = null
    // 开始前重置是成功状态
    isSuccessful.value = false;
    try {
      // 优化：复用缓存，假如之前请求过该接口，就不重复请求
      if (!isRefresh && categoryList.value.length) {
        isLoading.value = false;
        isSuccessful.value = true;
        return {
          success: true,
          code: 200,
          message: 'success',
          data: {
            list: categoryList.value,
            pagination: pagination.value
          }
        } as CategoryListResponse;
      }
      const defaultParams = { page: 1, pageSize: 10 };
      const pageParams = isRefresh
        ? { pageNum: defaultParams.page, pageSize: defaultParams.pageSize }
        : { pageNum: pagination.value.page, pageSize: pagination.value.pageSize };
      const unitParams = { ...defaultParams, ...pageParams, ...params };
      currentParams.value = unitParams;
      const response = await CategoryAPI.getCategoryList(unitParams, config);
      if (response.success) {
        isSuccessful.value = true;
        if (isRefresh) {
          categoryList.value = response.data.list
        } else {
          categoryList.value = [...categoryList.value, ...response.data.list]
        }
        pagination.value = response.data.pagination
      } else {
        isSuccessful.value = false;
        const errorRes = ErrorResponseSchema.parse(response) as ErrorResponse;
        errorMsg.value = `[${errorRes.code}] ${errorRes.message}`
        // 3. 分类错误处理（根据错误码做特殊逻辑）
        switch (Math.floor(errorRes.code / 100)) {
          case 4:
            // 4xx 客户端错误（如参数错误、权限不足）
            console.warn('客户端错误：', errorRes);
            // 可添加额外逻辑：如 401 跳转登录、403 显示无权限提示
            if (errorRes.code === 401) {
              // 示例：跳转登录页（需导入路由）
              // router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
            }
            break;
          case 5:
            // 5xx 服务端错误
            console.error('服务端错误：', errorRes);
            // 可添加额外逻辑：如上报错误到监控平台
            // reportError('categoryListFetchError', errorRes);
            break;
        }
        // 抛出错误，允许组件捕获处理
        throw new Error(errorMsg.value);
      }
      return response
    } catch (error) {
      // 捕获两类错误：
      // 1. API 响应的业务错误（上面抛出的）
      // 2. 网络错误、校验错误（如响应格式不符合成功/失败规范）
      isSuccessful.value = false;
      if (error instanceof Error) {
        errorMsg.value = error.message;
      } else {
        errorMsg.value = '获取标签列表失败，请检查网络或联系管理员';
      }
      console.error('❌ 标签列表请求失败：', error);
      throw error;
    } finally {
      // 8. 无论成功失败，结束加载状态
      isLoading.value = false;
    }
  }

  const loadMoreCategoryList = async (params?: CategoryListParams, config?: AxiosRequestConfig) => {
    if (!pagination.value.hasNext) {
      errorMsg.value = '已加载全部标签'
      return;
    }
    await fetchCategoryList(
      { ...currentParams.value, ...params, page: pagination.value.page + 1 },
      false,
      config
    );
  }

  const changePageSize = async (pageSize: number, params?: CategoryListParams, config?: AxiosRequestConfig) => {
    resetState();
    await fetchCategoryList(
      { ...currentParams.value, ...params, pageSize, page: 1 },
      true,
      config
    );
  };

  const goToPage = async (page: number, params?: CategoryListParams, config?: AxiosRequestConfig) => {
    if (page < 1 || page > (pagination.value.totalPages ?? 0)) {
      errorMsg.value = '页码超出范围';
      return;
    }
    if (page === pagination.value.page) return;
    await fetchCategoryList(
      { ...currentParams.value, ...params, page },
      true,
      config
    );
  };

  const refreshCategoryList = async (config?: AxiosRequestConfig) => {
    await fetchCategoryList(currentParams.value, true, config);
  };

  const clearCategoryCache = () => {
    resetState();
    currentParams.value = {
      page: 1,
      pageSize: 10,
      keyword: ''
    };
  };
  return {
    categoryList,
    pagination,
    isLoading,
    isSuccessful,
    errorMsg,
    errorCode, // 暴露错误码
    currentParams,
    getCategoryTotal,
    hasNextPage,
    hasPrevPage,
    getCategoryById,
    getCategorysByName,
    getHotCategorys,
    fetchCategoryList,
    loadMoreCategoryList,
    changePageSize,
    goToPage,
    refreshCategoryList,
    resetState,
    clearCategoryCache,
  };
})

export default useCategoryStore;