import type { AxiosRequestConfig } from "axios";
import { get } from '@/utils/request.util'
 import type { TagListParams, TagListResponse } from "@/types/apis/tag.type";



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
    const defaultParams = { pageNum: 1, pageSize: 20 };
    return get<TagListResponse>('/web/tag/', { ...defaultParams, ...params }, config);
  },
}

export default TagAPI;