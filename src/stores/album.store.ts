import { AlbumAPI } from '@/apis/album.api';
import type { Album, AlbumDetailQuery, AlbumListQuery, Photo } from '@/schemas/album.schema';
import type { Pagination } from '@/schemas/base.schema';
import { useTimeoutFn } from '@vueuse/core';
import type { AxiosRequestConfig } from 'axios';
import { defineStore } from "pinia";
import { reactive, ref } from 'vue';



/** ---------- 类型定义 ---------- */
/** 当前选择相册类型 */
export type CurrentAlbum = Pick<Album, 'slug' | 'name' | 'title' | 'description'> | null;



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
/** 初始化相册数据 */
const INIT_STATE = {
  albumList: [] as Album[],
  photoList: [] as Photo[],
  pagination: { ...INIT_PAGINATION },
  photoPagination: { ...INIT_PAGINATION },
  currentAlbum: null as CurrentAlbum,
  currentPhoto: null as Photo | null,
  currentPhotoIndex: -1,
  isLoading: false,
  errorMsg: null as string | null,
  errorCode: null as number | null,
}

export const useAlbumStore = defineStore('ablum', () => {
  /** ---------- 响应式数据 ---------- */
  /** 相册列表 */
  const albumList = ref<Album[]>([...INIT_STATE.albumList]);
  /** 相册分页信息 */
  const pagination = ref<Pagination>({ ...INIT_STATE.pagination });
  /** 当前相册 */
  const currentAlbum = ref<CurrentAlbum>(INIT_STATE.currentAlbum);

  /** 照片列表 */
  const photoList = ref<Photo[]>([...INIT_STATE.photoList]);
  /** 当前选择图片数组Index */
  const currentPhotoIndex = ref<number>(-1);
  /** 当前所选照片 */
  const currentPhoto = ref<Photo | null>(null);
  /** 照片分页信息 */
  const photoPagination = ref<Pagination>({ ...INIT_STATE.photoPagination });

  /** 加载状态表 (优化：区分不同操作的加载状态) */
  const loadingMap = reactive({
    list: INIT_STATE.isLoading,
    detail: INIT_STATE.isLoading,
  });
  
  /** 当前查询参数 */
  const currentQuery = ref<AlbumListQuery>({
    page: INIT_STATE.pagination.page,
    pageSize: INIT_STATE.pagination.pageSize,
  })
  /** 错误信息 */
  const errorMsg = ref<string | null>(INIT_STATE.errorMsg);
  /** 错误代码 */
  const errorCode = ref<number | null>(INIT_STATE.errorCode);


  /** ---------- 辅助方法 ---------- */
  /**
   * 格式化分页参数（确保合法，避免异常值）
   * @param params 查询参数
   * @param isRefresh 是否刷新
   * @returns 格式化后的查询参数
   */
  const formatPageQuery = (
    params: Partial<AlbumListQuery>,
    isRefresh: boolean = true
  ) => {
    const defaultPage = { page: 1, pageSize: 10 };
    return {
      ...defaultPage,
      ...params,
      page: isRefresh ? defaultPage.page : params.page || defaultPage.page,
      pageSize: isRefresh ? defaultPage.pageSize : params.pageSize || defaultPage.pageSize,
    }
  }
  
  /**
   * 初始化错误信息
   * @param msg 错误信息
   * @param code 错误代码
   */
  const initError = (msg: string | null, code: number | null) => {
    errorMsg.value = msg;
    errorCode.value = code;
  }

  /** 
   * 延迟关闭loading状态
   * @param key 加载状态键名
   * @param delay 延迟时间（毫秒）
   */
  const delayCloseLoading = (key: keyof typeof loadingMap, delay: number = 300) => {
    useTimeoutFn(() => {
      loadingMap[key] = false;
    }, delay)
  }


  /**
   * 重置状态（离开页面时调用）
   */
  const resetState = () => {
    albumList.value = [...INIT_STATE.albumList];
    photoList.value = [...INIT_STATE.photoList];
    pagination.value = { ...INIT_STATE.pagination };
    photoPagination.value = { ...INIT_STATE.photoPagination };
    currentAlbum.value = INIT_STATE.currentAlbum;
    currentPhoto.value = INIT_STATE.currentPhoto;
    currentPhotoIndex.value = INIT_STATE.currentPhotoIndex;
    loadingMap.list = INIT_STATE.isLoading;
    loadingMap.detail = INIT_STATE.isLoading;
    errorMsg.value = INIT_STATE.errorMsg;
    errorCode.value = INIT_STATE.errorCode;
  }

  /** ---------- 照片相关方法 ---------- */
  /** 下一站照片 */
  const nextPhoto = () => {
    currentPhotoIndex.value++;
    currentPhotoIndex.value = currentPhotoIndex.value % photoList.value.length;
    const target = photoList.value[currentPhotoIndex.value];
    currentPhoto.value = target ?? null;
  }
  /** 上一张图片 */
  const prevPhoto = () => {
    currentPhotoIndex.value--;
    currentPhotoIndex.value = currentPhotoIndex.value < 0 ? photoList.value.length - 1 : currentPhotoIndex.value;
    const target = photoList.value[currentPhotoIndex.value];
    currentPhoto.value = target ?? null;
  }

  /** ---------- 核心方法 ---------- */
  /**
   * 获取相册列表
   * @param query 查询参数
   * @param isRefresh 是否刷新
   * @param config axios 配置
   * @returns 相册列表
   */
  const fetchAlbumList = async (
    query: Partial<AlbumListQuery>,
    isRefresh: boolean = true,
    config?: AxiosRequestConfig
  ) => {
    loadingMap.list = true;
    // 初始化错误信息
    initError(null, null);

    try {
      // 是否使用缓存
      const shouldUseCache = !isRefresh && albumList.value.length > 0;
      if (shouldUseCache) {
        useTimeoutFn(() => {
          loadingMap.list = false;
        }, 500)
        return {
          success: true,
          code: 200,
          message: 'success',
          data: {
            list: albumList.value,
            pagination: pagination.value,
          },
        }
      }
      
      // 格式化分页参数
      const formattedQuery = formatPageQuery(query, isRefresh);
      // 发送请求
      const res = await AlbumAPI.getAlbumList(formattedQuery, config);
      // 更新数据
      albumList.value = res.data?.list || [];
      pagination.value = res.data?.pagination || { ...INIT_PAGINATION };
      // 初始化错误信息
      initError(null, null);
    } catch (error: any) {
      // 处理错误
      initError(error.message || '获取相册列表失败', error.code || 500);
    } finally {
      loadingMap.list = false;
    }
  }

  /**
   * 获取相册详情（照片列表）
   * @param slug 相册 slug
   * @param config axios 配置
   */
  const fetchAlbumDetail = async (
    slug: string,
    query: Partial<AlbumDetailQuery>,
    isRefresh: boolean = true,
    config?: AxiosRequestConfig
  ) => {
    loadingMap.detail = true;
    initError(null, null);

    try {
      // 是否使用缓存
      const shouldUseCache = !isRefresh && photoList.value.length > 0;
      if (shouldUseCache) {
        useTimeoutFn(() => {
          loadingMap.detail = false;
        }, 500)
        return {
          success: true,
          code: 200,
          message: 'success',
          data: {
            album: currentAlbum,
            list: photoList.value,
            pagination: photoPagination.value,
          },
        }
      }

      // 格式化分页参数
      const formattedQuery = formatPageQuery(query, isRefresh);
      const res = await AlbumAPI.getAlbumDetail(slug, formattedQuery, config);
      photoList.value = res.data?.list || [];
      photoPagination.value = res.data?.pagination || { ...INIT_PAGINATION };
      // 更新当前相册
      currentAlbum.value = res.data?.album || null;
    } catch (error: any) {
      initError(error.message || '获取相册详情失败', error.code || 500);
    } finally {
      loadingMap.detail = false;
    }
  }

  return {
    albumList,
    photoList,
    pagination,
    photoPagination,
    currentAlbum,
    currentPhotoIndex,
    currentPhoto,

    loadingMap,
    currentQuery,
    errorMsg,
    errorCode, 

    fetchAlbumList,
    fetchAlbumDetail,
    resetState,
    prevPhoto,
    nextPhoto,
  }
})