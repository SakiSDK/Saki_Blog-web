import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TagAPI } from '@/apis/tag.api'
import type { TagListParams, TagListResponse, Tag, Pagination, HotTagsParams, HotTagsResponse } from '@/schemas/tag.schema'; 
import type { AxiosRequestConfig } from 'axios';
import { ErrorResponseSchema, type ErrorResponse } from '@/schemas/base.schema';
import { useTimeoutFn } from '@vueuse/core';


export const useTagStore = defineStore('tag', () => {
  const tagList = ref<Tag[]>([])
  const hotTags = ref<Tag[]>([])
  const pagination = ref<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const isLoading = ref(false)
  const isHotTagsLoading = ref(false)
  const errorMsg = ref<string | null>(null)
  const hotTagsErrorMsg = ref<string | null>(null)
  const currentParams = ref<TagListParams>({
    page: 1,
    pageSize: 10,
    keyword: ''
  })
  const errorCode = ref<number | null>(null);
  const isSuccessful = ref<boolean>(false);
  const isHotTagsSuccessful = ref<boolean>(false);
  const isPageReloaded = ref<boolean>(false);


  /** ---------- 计算属性 ---------- */
  const getTagTotal = computed(() => pagination.value.total)
  const hasNextPage = computed(() => pagination.value.hasNext)
  const hasPrevPage = computed(() => pagination.value.hasPrev)
  const getTagById = computed(() => (id: number) => tagList.value.find(tag => tag.id === id))
  const getTagsByName = computed(() => (name: string) => tagList.value.filter(tag => tag.name.includes(name)))

  /** ---------- 方法 ---------- */
  const resetState = () => { 
    tagList.value = []
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
    isPageReloaded.value = false
  }

  // const linstenPageReload = () => {
  //   useEventListener(window, 'beforeunload', () => {
  //     isPageReloaded.value = true;
  //   })
  //   // onBeforeUnmount(() => {
  //   //   window.removeEventListener('beforeunload', () => {
  //   //     isPageReloaded.value = false;
  //   //   })
  //   // })
  // }
  const fetchHotTags = async (
    params?: HotTagsParams,
    isRefresh: boolean = false,
    config?: AxiosRequestConfig
  ): Promise<HotTagsResponse> => {
    isHotTagsLoading.value = true;
    hotTagsErrorMsg.value = null;
    // 开始前重置成功状态
    isHotTagsSuccessful.value = false;

    try {
      // 1. 缓存复用逻辑（与 fetchTagList 一致）
      const shouldUseCache = !isRefresh && !isPageReloaded.value && hotTags.value.length > 0;
      if (shouldUseCache) {
        console.log('路由切换，复用热门标签缓存，不重新请求');
        isHotTagsLoading.value = false;
        isHotTagsSuccessful.value = true;
        return {
          success: true,
          code: 200,
          message: 'success',
          data: {
            list: hotTags.value,
            total: hotTags.value.length, // 热门标签通常不分页，total 直接取列表长度
            pageSize: hotTags.value.length,
          },
        } as HotTagsResponse;
      }

      // 2. 参数合并（默认值 + 传入参数）
      const defaultParams: Required<HotTagsParams> = {
        pageSize: 10, // 默认返回10个热门标签
        withPostCount: true, // 强制返回文章数量（热门标签核心字段）
      };
      // 热门标签通常不需要分页（pageNum），仅保留 pageSize 和 withPostCount
      const unitParams = { ...defaultParams, ...params };
      // 可选：记录当前参数（如需调试或重新请求）
      const currentHotTagParams = unitParams;

      // 3. 发起API请求
      const response = await TagAPI.getHotTags(unitParams, config);

      // 4. 响应成功处理
      if (response.success) {
        isHotTagsSuccessful.value = true;
        // 强制刷新时直接替换，非刷新时也替换（热门标签无需累加）
        hotTags.value = response.data.list;

        return response;
      }

      // 5. 业务错误处理（响应成功但 success: false）
      isHotTagsSuccessful.value = false;
      const errorRes = ErrorResponseSchema.parse(response) as ErrorResponse;
      hotTagsErrorMsg.value = `[${errorRes.code}] ${errorRes.message}`;

      // 6. 分类错误处理（与 fetchTagList 一致）
      switch (Math.floor(errorRes.code / 100)) {
        case 4:
          console.warn('热门标签请求客户端错误：', errorRes);
          if (errorRes.code === 401) {
            // 401 跳转登录页（复用 fetchTagList 逻辑）
            // router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
          }
          break;
        case 5:
          console.error('热门标签请求服务端错误：', errorRes);
          // 可选：错误上报
          // reportError('hotTagsFetchError', errorRes);
          break;
      }

      // 抛出错误，允许组件捕获处理
      throw new Error(hotTagsErrorMsg.value);

    } catch (error) {
      console.log(error);
      // 7. 异常捕获（网络错误、格式校验错误等）
      isHotTagsSuccessful.value = false;
      if (error instanceof Error) {
        hotTagsErrorMsg.value = error.message;
      } else {
        hotTagsErrorMsg.value = '获取热门标签失败，请检查网络或联系管理员';
      }
      console.error('❌ 热门标签请求失败：', error);
      throw error;

    } finally {
      // 8. 无论成功失败，结束加载状态
      isHotTagsLoading.value = false;
    }
  }


  const fetchTagList = async (
    params?: TagListParams,
    isRefresh: boolean = false,
    config?: AxiosRequestConfig
  ): Promise<TagListResponse> => { 
    isLoading.value = true
    errorMsg.value = null
    // 开始前重置是成功状态
    isSuccessful.value = false;
    try {
      const shouldUseCache = !isRefresh && !isPageReloaded.value && tagList.value.length > 0;
      if (shouldUseCache) {
        useTimeoutFn(() => {
          isLoading.value = false;
        }, 500)
        isSuccessful.value = true;
        return {
          success: true,
          code: 200,
          message: 'success',
          data: {
            list: tagList.value,
            pagination: pagination.value
          }
        } as TagListResponse;
      }
      const defaultParams = { page: 1, pageSize: 10 };
      const pageParams = isRefresh
        ? { pageNum: defaultParams.page, pageSize: defaultParams.pageSize }
        : { pageNum: pagination.value.page, pageSize: pagination.value.pageSize };
      const unitParams = { ...defaultParams, ...pageParams, ...params };
      currentParams.value = unitParams;
      const response = await TagAPI.getTagList(unitParams, config);
      if (response.success) {
        isSuccessful.value = true;
        if (isRefresh) {
          tagList.value = response.data.list
        } else {
          tagList.value = [...tagList.value, ...response.data.list]
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
            // reportError('tagListFetchError', errorRes);
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
      useTimeoutFn(() => {
        isLoading.value = false;
      }, 500)
    }
  }

  const loadMoreTagList = async (params?: TagListParams, config?: AxiosRequestConfig) => {
    if (!pagination.value.hasNext) {
      errorMsg.value = '已加载全部标签'
      return;
    }
    await fetchTagList(
      { ...currentParams.value, ...params, page: pagination.value.page + 1 },
      false,
      config
    );
  }

  const changePageSize = async (pageSize: number, params?: TagListParams, config?: AxiosRequestConfig) => {
    resetState();
    await fetchTagList(
      { ...currentParams.value, ...params, pageSize, page: 1 },
      true,
      config
    );
  };

  const goToPage = async (page: number, params?: TagListParams, config?: AxiosRequestConfig) => {
    if (page < 1 || page > (pagination.value.totalPages ?? 0)) {
      errorMsg.value = '页码超出范围';
      return;
    }
    if (page === pagination.value.page) return;
    await fetchTagList(
      { ...currentParams.value, ...params, page },
      true,
      config
    );
  };

  const refreshTagList = async (config?: AxiosRequestConfig) => {
    await fetchTagList(currentParams.value, true, config);
  };

  const clearTagCache = () => {
    resetState();
    currentParams.value = {
      page: 1,
      pageSize: 10,
      keyword: ''
    };
  };
  return {
    hotTags,
    tagList,
    pagination,
    isLoading,
    isHotTagsLoading,
    isSuccessful, 
    isHotTagsSuccessful,
    isPageReloaded,
    errorMsg,
    errorCode, // 暴露错误码
    currentParams,
    getTagTotal,
    hasNextPage,
    hasPrevPage,
    getTagById,
    getTagsByName,
    fetchHotTags,
    fetchTagList,
    // linstenPageReload,
    loadMoreTagList,
    changePageSize,
    goToPage,
    refreshTagList,
    resetState,
    clearTagCache,
  };
})

export default useTagStore;