import type { AxiosRequestConfig } from "axios";
import { get } from '@/utils/request.util'
import type { HotTagsParams, HotTagsResponse, TagListParams, TagListResponse } from "@/types/entities";
import { validateRequest, validateResponse } from "@/utils/validate.util";
import { HostTagsParamsSchema, HotTagsResponseSchema, TagListParamsSchema, TagListResponseSchema } from "@/schemas/tag.schema";


/** ---------- Tag API 封装 ---------- */
export const TagAPI = {
  /**
   * 获取标签列表（分页）
   * @param params - 筛选和分页参数
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getTagList: async (
    params?: TagListParams,
    config?: AxiosRequestConfig
  ): Promise<TagListResponse> => {
    // 默认参数：pageNum=1，pageSize=10
    const defaultParams: TagListParams = { page: 1, pageSize: 10 };
    const unitParams: TagListParams = {
      ...defaultParams,
      ...params
    }
    const safeParams = validateRequest(TagListParamsSchema, unitParams);
    const res = await get<TagListResponse>('/web/tag/', safeParams, config);
    return validateResponse(TagListResponseSchema, res);
  },

  /**
   * 获取热门标签
   * @param params - 筛选和分页参数
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getHotTags: async (
    params?: HotTagsParams,
    config?: AxiosRequestConfig
  ): Promise<HotTagsResponse> => {
    const defaultParams: HotTagsParams = { pageSize: 10, withPostCount: true };
    const unitParams: HotTagsParams = {
      ...defaultParams,
      ...params
    }
    const safeParams = validateRequest(HostTagsParamsSchema, unitParams);
    const res = await get<HotTagsResponse>('/web/tag/hot', safeParams, config);
    return validateResponse(HotTagsResponseSchema, res);
  }
}

export default TagAPI;