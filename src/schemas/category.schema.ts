import { z } from 'zod';
import {
  PaginationSchema, ResponseSchema, zDate, zId,
  zPageNum, zPageSize, zSearchKeyword,
  zStr, zInteger,
} from './base.schema';


/** ---------- 分类基础字段 ---------- */
/** 分类 id */
export const CategoryIdSchema = zId.describe("分类ID");
/** 分类名称 */
export const CategoryNameSchema = zStr.max(50, "分类名最多50个字符")
  .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5\-\s]+$/, "分类名只能包含中英文、数字、下划线、横线和空格")
  .describe('分类名称');
/** 分类别名 */
export const CategorySlugSchema = zStr.max(50, "分类别名最多50个字符")
  .regex(/^[a-z0-9\-]+$/, "分类别名只能包含小写字母、数字和横线")
  .toLowerCase().describe("分类别名");
/** 分类描述 */
export const CategoryDescriptionSchema = zStr.max(500, "描述最多500个字符").optional().describe("分类描述");
/** 分类字段优先级 */
export const CategoryOrderSchema = zInteger.min(0, "分类字段优先级不能小于 0").describe("分类字段优先级");
/** 分类文章数量 */
export const CategoryPostCountSchema = zInteger.min(0, "分类文章数量不能小于 0").describe("分类文章数量");
/** 分类创建时间 */
export const CategoryCreatedAtSchema = zDate.describe("分类创建时间");

/** 分类简要信息 */
export const BriefCategorySchema = z.object({
  id: CategoryIdSchema,
  name: CategoryNameSchema,
  slug: CategorySlugSchema,
})

/** 分类信息 */
const CategorySchema = BriefCategorySchema.extend({
  desciption: CategoryDescriptionSchema,
  postCount: CategoryPostCountSchema,
  order: CategoryOrderSchema,
  createdAt: CategoryCreatedAtSchema,
})

/** 分类返回值类型 */
export const CategoryListDataSchema = z.object({
  list: z.array(CategorySchema),
  pagination: PaginationSchema
})

/** ---------- 分类列表完整响应 Schema + 类型推导 ---------- */
/** 分类列表接口的完整响应 */
export const CategoryListResponseSchema = ResponseSchema(CategoryListDataSchema);

/** ---------- 分类请求的schema ---------- */
export const CategoryListParamsSchema = z.object({
  page: zPageNum,
  pageSize: zPageSize,
  keyword: zSearchKeyword.optional().describe("搜索关键词"),
})


/** ---------- 类型推导 ---------- */
export type Category = z.infer<typeof CategorySchema>; // 单个标签类型
export type BriefCategory = z.infer<typeof BriefCategorySchema>; // 简要标签类型

export type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>; // 完整响应类型
export type Pagination = z.infer<typeof PaginationSchema>; // 分页类型
export type CategoryListData = z.infer<typeof CategoryListDataSchema>; // 业务数据类型
export type CategoryListParams = z.infer<typeof CategoryListParamsSchema>;
