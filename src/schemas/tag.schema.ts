import { z } from 'zod';
import { PaginationSchema, ResponseSchema } from './base.schema';


const TagSchema = z.object({
  id: z
    .number("ID 必须是数字")
    .int("ID 必须是整数")
    .describe("ID"),
  name: z
    .string("标签名必须是文本")
    .trim()
    .min(1, "标签名不能为空")
    .max(50, "标签名最多50个字符")
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5\-\s]+$/, "标签名只能包含中英文、数字、下划线、横线和空格")
    .describe("标签名称"),
  slug: z
    .string("标签别名必须是文本")
    .trim()
    .min(1, "标签别名不能为空")
    .max(50, "标签别名最多50个字符")
    .regex(/^[a-z0-9\-]+$/, "标签别名只能包含小写字母、数字和横线")
    .toLowerCase()
    .describe("标签别名"),
  desciption: z
    .string("描述必须是文本")
    .trim()
    .max(500, "描述最多 500 个字符")
    .optional()
    .describe("描述"),
  postCount: z
    .number("文章数量必须是数字")
    .int("文章数量必须是整数")
    .min(0, "文章数量不能小于 0")
    .describe("文章数量"),
  order: z
    .number("排序必须是数字")
    .int("排序必须是整数")
    .min(0, "排序不能小于 0")
    .describe("排序"),
  createdAt: z.string().datetime(),
})

const zPageSize = z
    .number("页大小必须是数字")
    .int("页大小必须是整数")
    .positive("页大小必须是正数")
    .default(10)
    .optional()
    .describe("页大小")

export const TagListDataSchema = z.object({
  list: z.array(TagSchema),
  pagination: PaginationSchema
})
export const HotTagsSchema = z.object({
  list: z.array(TagSchema),
})

/** ---------- 标签列表完整响应 Schema + 类型推导 ---------- */
// 组合出标签列表接口的完整响应 Schema
export const TagListResponseSchema = ResponseSchema(TagListDataSchema);
export const HotTagsResponseSchema = ResponseSchema(HotTagsSchema);

/** ---------- 标签请求的schema ---------- */
export const TagListParamsSchema = z.object({
  page: z
    .number("页码必须是数字")
    .int("页码必须是整数")
    .positive("页码必须是正数")
    .default(1)
    .optional()
    .describe("页码"),
  pageSize: zPageSize,
  keyword: z
    .string("搜索关键词必须是文本")
    .trim()
    .max(50, "搜索关键词最多50个字符")
    .optional()
    .describe("搜索关键词")
})
export const HostTagsParamsSchema = z.object({
  pageSize: zPageSize,
  withPostCount: z.boolean().default(true).optional(),
})


export type Tag = z.infer<typeof TagSchema>; // 单个标签类型
export type Pagination = z.infer<typeof PaginationSchema>; // 分页类型
export type TagListData = z.infer<typeof TagListDataSchema>; // 业务数据类型

/** ---------- 返回类型 ---------- */
export type TagListResponse = z.infer<typeof TagListResponseSchema>; // 完整响应类型
export type HotTagsResponse = z.infer<typeof HotTagsResponseSchema>;

/** ---------- 请求类型 ---------- */
export type TagListParams = z.infer<typeof TagListParamsSchema>;
export type HotTagsParams = z.infer<typeof HostTagsParamsSchema>;