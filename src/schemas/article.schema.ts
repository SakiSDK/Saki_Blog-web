import { z } from 'zod';
import { PaginationSchema, ResponseSchema, zBoolean, zDate, zInteger, zSortOrder, zStr, zPageNum, zPageSize, zId } from './base.schema';
import { BriefTagSchema } from './tag.schema';


/** ---------- 文章基础字段 ---------- */
/** 文章 shortId */
export const ArticleShortIdSchema = zStr.length(6, "shortId 必须是 6 位").describe("文章 shortId");
/** 文章标题 */
export const ArticleTitleSchema = zStr.max(255, "标题字数最多位 255 位").describe('文章标题');
/** 文章标签列表 */
export const ArticleTagListSchema = z.array(BriefTagSchema).describe('文章标签列表');
/** 文章分类列表 */
export const ArticleCategoryListSchema = z.array(BriefTagSchema).describe('文章分类列表');
/** 文章优先级 */
export const ArticlePrioritySchema = zInteger.min(0, '优先级不能小于 0').max(100, '优先级不能大于 100').default(0).describe("文章优先级");
/** 文章封面图片 URL */
export const ArticleCoverSchema = zStr.max(255, "封面图片 URL 字数最多位 255 位").describe("文章封面图片 URL");
/** 文章状态 */
export const ArticleStatusSchema = z.enum(['draft', 'published']).default('draft').describe('文章状态');
/** 文章描述 */
export const ArticleDescriptionSchema = zStr.max(255, "简介字数最多位 255 位").describe("文章简介");
/** 文章内容 */
export const ArticleContentSchema = zStr.describe("文章内容");
/** 允许评论 */
export const ArticleAllowCommentSchema = zBoolean.default(true).describe("是否允许评论");
/** 文章排序方式 */
export const ArticleSortSchema = zSortOrder;
/** 文章排序字段 */
export const ArticleOrderBySchema = z.enum(['id', 'createdAt', 'updatedAt', 'priority']).default('createdAt').describe("排序字段");
/** 文章封面路径 */
export const ArticleCoverPathSchema = zStr.max(255, "封面图片路径 字数最多位 255 位").describe("文章封面路径");
/** 文章图片路径列表 */
export const ArticleImagePathsSchema = z.array(zStr.max(255, "图片路径 字数最多位 255 位")).describe("文章图片路径列表");
/** 文章封面缩略图 */
export const ArticleThumbCoverSchema = zStr.max(255, "封面图片 URL 字数最多位 255 位").describe("文章封面缩略图片 URL");

/** 作者信息 */
export const AuthorSchema = z.object({
  id: zId.describe("作者 ID"),
  nickname: zStr.max(32, "作者字数最多位 32 位").describe("作者姓名"),
  avatar: zStr.max(255, "头像 URL 字数最多位 255 位").describe("作者头像 URL"),
})
export type Author = z.infer<typeof AuthorSchema>;

/** 最新文章信息 */
export const LatestArticleSchema = z.object({
  shortId: ArticleShortIdSchema,
  title: ArticleTitleSchema,
  thumbCover: ArticleThumbCoverSchema,
  createdAt: zDate,
})

/** 首页文章信息 */
export const HomeArticleSchema = z.object({
  shortId: ArticleShortIdSchema,
  title: ArticleTitleSchema,
  categories: ArticleCategoryListSchema,
  tags: ArticleTagListSchema,
  cover: ArticleCoverSchema,
  createdAt: zDate.describe("创建时间"),
})

/** 首页文章列表信息 */
export const HomeArticleListSchema = z.object({
  list: z.array(HomeArticleSchema).describe('首页文章列表'),
  pagination: PaginationSchema.describe('分页信息'),
})

/** 文章详细信息 */
export const ArticleDetailSchema = HomeArticleSchema.extend({
  author: AuthorSchema,
  priority: ArticlePrioritySchema,
  status: ArticleStatusSchema,
  description: ArticleDescriptionSchema,
  content: ArticleContentSchema,
  allowComment: ArticleAllowCommentSchema,
})

/** 最新文章列表 */
export const LatestArticleListSchema = z.object({
  list: z.array(LatestArticleSchema).describe('最新文章列表'),
})



/** ---------- 文章列表完整响应schema ---------- */
/** 首页文章列表完整响应 */
export const HomeArticleListResponseSchema = ResponseSchema(HomeArticleListSchema);
/** 文章详细信息完整响应 */
export const ArticleDetailResponseSchema = ResponseSchema(ArticleDetailSchema);
/** 最新文章列表返回值类型 */
export const LatestArticleListResponseSchema = ResponseSchema(LatestArticleListSchema);



/** ---------- 请求参数 schema ---------- */
/** 首页文章列表请求参数 */
export const HomeArticleListQuerySchema = z.object({
  page: zPageNum,
  pageSize: zPageSize.default(6),
  keyword: zStr.optional().describe("搜索关键字"),
})
/** 获取文章详细信息参数 */
export const ArticleDetailParamsSchema = z.object({
  shortId: ArticleShortIdSchema,
})


/** ---------- 类型推导 ---------- */
/** 首页文章类型 */
export type HomeArticle = z.infer<typeof HomeArticleSchema>;
/** 文章详细信息 */
export type ArticleDetail = z.infer<typeof ArticleDetailSchema>;
/** 最新文章类型 */
export type LatestArticle = z.infer<typeof LatestArticleSchema>

/** 首页文章列表返回值类型 */
export type HomeArticleListResponse = z.infer<typeof HomeArticleListResponseSchema>;
/** 首页文章列表请求类型 */
export type HomeArticleListQuery = z.infer<typeof HomeArticleListQuerySchema>;

/** 文章详细信息返回值类型 */
export type ArticleDetailResponse = z.infer<typeof ArticleDetailResponseSchema>;
/** 获取文章详细信息参数类型 */
export type ArticleDetailParams = z.infer<typeof ArticleDetailParamsSchema>;
/** 获取最新文章返回值类型 */
export type LatestArticleListResponse = z.infer<typeof LatestArticleListResponseSchema>;
