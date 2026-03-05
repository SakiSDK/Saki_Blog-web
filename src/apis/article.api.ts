import { type AxiosRequestConfig } from 'axios';
import { get } from '@/utils/request.util';
import { validateRequest, validateResponse } from "@/utils/validate.util";
import {
  ArticleDetailParamsSchema, ArticleDetailResponseSchema, HomeArticleListQuerySchema,
  HomeArticleListResponseSchema,
  LatestArticleListResponseSchema,
  type ArticleDetailResponse, type HomeArticleListQuery, type HomeArticleListResponse,
  type LatestArticleListResponse
} from '@/schemas/article.schema';


/** ---------- Article API 封装 ---------- */
export const ArticleAPI = {
  /**
   * 获取首页文章列表（分页）
   * @param params - 筛选和分页参数
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getHomeArticleList: async (
    params?: HomeArticleListQuery,
    config?: AxiosRequestConfig
  ): Promise<HomeArticleListResponse> => {
    // 默认参数: pageNum=1, pageSize=6
    const defaultParams = { pageNum: 1, pageSize: 6 };
    const unitParams = {
      ...defaultParams,
      ...params
    }
    const safeParams = validateRequest(HomeArticleListQuerySchema, unitParams);
    const res = await get<HomeArticleListResponse>('/article/', safeParams, config);
    console.log('getHomeArticleList', res);
    return validateResponse(HomeArticleListResponseSchema, res);
  },

  /**
   * 获取文章详细信息
   * @param shortId - 文章短 ID
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getArticleDetail: async (
    shortId: string,
    config?: AxiosRequestConfig
  ): Promise<ArticleDetailResponse> => {
    const safeParams = validateRequest(ArticleDetailParamsSchema, { shortId });
    const res = await get<ArticleDetailResponse>(`/article/${shortId}`, safeParams, config);
    console.log('getArticleDetail', res);
    return validateResponse(ArticleDetailResponseSchema, res);
  },

  /** 获取最新文章信息 */
  getLatestArticle: async (
    config?: AxiosRequestConfig
  ): Promise<LatestArticleListResponse> => {
    const res = await get<LatestArticleListResponse>('/article/latest', {}, config);
    console.log('getLatestArticle', res);
    return validateResponse(LatestArticleListResponseSchema, res);
  }
}