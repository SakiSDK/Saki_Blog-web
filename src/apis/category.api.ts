import type { AxiosRequestConfig } from "axios";
import { get } from '@/utils/request.util'
import type { CategoryListParams, CategoryListResponse } from "@/types/entities";
import { validateRequest, validateResponse } from "@/utils/validate.util";
import { CategoryListParamsSchema, CategoryListResponseSchema } from "@/schemas/category.schema";



/** ---------- Category API 封装 ---------- */
export const CategoryAPI = {
  /**
   * 获取标签列表（分页）
   * @param params - 筛选和分页参数
   * @param config - 额外 Axios 配置（如 headers、timeout）
   */
  getCategoryList: async (
    params?: CategoryListParams,
    config?: AxiosRequestConfig
  ): Promise<CategoryListResponse> => {
    // 默认参数：pageNum=1，pageSize=10
    const defaultParams = { pageNum: 1, pageSize: 20 };
    const unitParams = {
      ...defaultParams,
      ...params
    }
    const safeParams = validateRequest(CategoryListParamsSchema, unitParams);
    const res = await get<CategoryListResponse>('/web/category/', safeParams, config);
    return validateResponse(CategoryListResponseSchema, res);
  },
}

export default CategoryAPI;