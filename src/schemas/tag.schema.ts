import { z } from 'zod';
import { PaginationSchema, ResponseSchema, zBoolean, zDate, zId, zInteger, zPageNum, zPageSize, zSearchKeyword, zStr } from './base.schema';


/** ---------- 标签基础字段 ---------- */
/** 标签 id */
export const TagIdSchema = zId.describe("标签ID");
/** 标签名称 */
export const TagNameSchema = zStr.max(50, "标签名最多50个字符")
  .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5\-\s]+$/, "标签名只能包含中英文、数字、下划线、横线和空格")
  .describe('标签名称');
/** 标签别名 */
export const TagSlugSchema = zStr.max(50, "标签别名最多50个字符")
  .regex(/^[a-z0-9\-]+$/, "标签别名只能包含小写字母、数字和横线")
  .toLowerCase().describe("标签别名");
/** 标签描述 */
export const TagDescriptionSchema = zStr.max(500, "描述最多500个字符").optional().describe("标签描述");
/** 标签字段优先级 */
export const TagOrderSchema = zInteger.min(0, "标签字段优先级不能小于 0").describe("标签字段优先级");
/** 标签文章数量 */
export const TagPostCountSchema = zInteger.min(0, "标签文章数量不能小于 0").describe("标签文章数量");
/** 标签创建时间 */
export const TagCreatedAtSchema = zDate.describe("标签创建时间");

/** 标签简要信息 */
export const BriefTagSchema = z.object({
  id: TagIdSchema,
  name: TagNameSchema,
  slug: TagSlugSchema,
})

/** 标签信息 */
const TagSchema = BriefTagSchema.extend({
  description: TagDescriptionSchema,
  postCount: TagPostCountSchema,
  order: TagOrderSchema,
  createdAt: TagCreatedAtSchema,
})

/** 标签返回值 */
export const TagListDataSchema = z.object({
  list: z.array(TagSchema).describe("标签列表"),
  pagination: PaginationSchema
})

/** 热门标签返回值 */
export const HotTagsSchema = z.object({
  list: z.array(TagSchema).describe("热门标签列表"),
})



/** ---------- 标签列表完整响应 Schema + 类型推导 ---------- */
/** 标签列表完整响应 */
export const TagListResponseSchema = ResponseSchema(TagListDataSchema);
/** 热门标签列表完整相应 */
export const HotTagsResponseSchema = ResponseSchema(HotTagsSchema);



/** ---------- 标签请求的schema ---------- */
/** 标签列表请求参数 */
export const TagListParamsSchema = z.object({
  page: zPageNum,
  pageSize: zPageSize,
  keyword: zSearchKeyword.optional(),
})
/** 热门标签列表请求参数 */
export const HostTagsParamsSchema = z.object({
  pageSize: zPageSize,
  withPostCount: zBoolean.default(true).optional().describe("是否返回文章数量"),
})


export type Tag = z.infer<typeof TagSchema>; // 单个标签类型
export type BriefTag = z.infer<typeof BriefTagSchema>; // 简要标签类型
export type Pagination = z.infer<typeof PaginationSchema>; // 分页类型
export type TagListData = z.infer<typeof TagListDataSchema>; // 业务数据类型

/** ---------- 返回类型 ---------- */
export type TagListResponse = z.infer<typeof TagListResponseSchema>; // 完整响应类型
export type HotTagsResponse = z.infer<typeof HotTagsResponseSchema>;

/** ---------- 请求类型 ---------- */
export type TagListParams = z.infer<typeof TagListParamsSchema>;
export type HotTagsParams = z.infer<typeof HostTagsParamsSchema>;