import {type AxiosRequestConfig } from 'axios'
import { get } from '@/utils/request.util';
import { validateRequest, validateResponse } from "@/utils/validate.util";
import {
  AlbumDetailQuerySchema,
  AlbumDetailResponseSchema, AlbumListQuerySchema, AlbumListResponseSchema,
  type AlbumDetailQuery,
  type AlbumDetailResponse, type AlbumListQuery, type AlbumListResponse
} from '@/schemas/album.schema';


/** ---------- Album API 封装 ---------- */
/** Album API */
export const AlbumAPI = {
  /**
   * 获取相册列表（分页）
   * @param query - 筛选和分页参数
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getAlbumList: async (
    query?: AlbumListQuery,
    config?: AxiosRequestConfig
  ): Promise<AlbumListResponse> => {
    // 默认参数：pageNum=1，pageSize=10
    const defaultQuery: AlbumListQuery = { page: 1, pageSize: 10 };
    const unitQuery: AlbumListQuery = {
      ...defaultQuery,
      ...query
    }
    const safeQuery = validateRequest(AlbumListQuerySchema, unitQuery);
    const res = await get<AlbumListResponse>('/album', safeQuery, config);
    console.log(res)
    return validateResponse(AlbumListResponseSchema, res);
  },
  
  /**
   * 获取相册详情
   * @param slug - 相册 slug
   * @param query - 筛选参数
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getAlbumDetail: async (
    slug: string,
    query?: AlbumDetailQuery,
    config?: AxiosRequestConfig
  ): Promise<AlbumDetailResponse> => {
        // 默认参数：pageNum=1，pageSize=10
    const defaultQuery: AlbumDetailQuery = { page: 1, pageSize: 10 };
    const unitQuery: AlbumDetailQuery = {
      ...defaultQuery,
      ...query
    }
    const safeQuery = validateRequest(AlbumDetailQuerySchema, unitQuery);
    const res = await get<AlbumDetailResponse>(`/album/${slug}/photos`, safeQuery, config);
    console.log(res);
    return validateResponse(AlbumDetailResponseSchema, res);
  },
}