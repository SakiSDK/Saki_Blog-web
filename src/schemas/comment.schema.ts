import { z } from 'zod';
import type { ZodType } from 'zod';
import { zId, zStr, zDate, PaginationSchema, ResponseSchema, zPageNum, zPageSize } from './base.schema';
import { AuthorSchema, type Author } from './article.schema';

/** ---------- 评论基础字段 ---------- */
/** 评论内容 */
export const CommentContentSchema = zStr.max(1000, "评论内容最多 1000 个字符").describe("评论内容");

/** 评论 ID */
export const CommentIdSchema = zId.describe("评论 ID");

/** 父评论 ID */
export const ParentIdSchema = zId.nullable().optional().describe("父评论 ID");

/** ---------- 评论信息 ---------- */
export interface Comment {
  id: number | string;
  content: string;
  createTime: Date;
  user: Author;
  parentId?: number | string | null;
  children?: Comment[];
}

export const CommentSchema: ZodType<Comment> = z.lazy(() => z.object({
  id: CommentIdSchema,
  content: CommentContentSchema,
  createTime: zDate.describe("评论时间"),
  user: AuthorSchema.describe("评论者信息"),
  parentId: ParentIdSchema,
  children: z.array(CommentSchema).optional().describe("子评论列表"),
}));

/** 评论列表信息 */
export const CommentListSchema = z.object({
  list: z.array(CommentSchema).describe('评论列表'),
  pagination: PaginationSchema.describe('分页信息'),
});

/** ---------- 评论列表完整响应schema ---------- */
export const CommentListResponseSchema = ResponseSchema(CommentListSchema);

/** ---------- 请求参数 schema ---------- */
/** 评论列表请求参数 */
export const CommentListQuerySchema = z.object({
  page: zPageNum,
  limit: zPageSize.default(10),
});

/** 创建评论请求参数 */
export const CreateCommentSchema = z.object({
  content: CommentContentSchema,
  parentId: ParentIdSchema,
});

/** ---------- 类型导出 ---------- */
// export type Comment = z.infer<typeof CommentSchema>; // Already defined via interface
export type CommentList = z.infer<typeof CommentListSchema>;
export type CommentListResponse = z.infer<typeof CommentListResponseSchema>;
export type CommentListQuery = z.infer<typeof CommentListQuerySchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
