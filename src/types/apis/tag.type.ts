/** ---------- 类型定义 ---------- */

import type { PaginationParams, Response } from "../core/app";

/** 标签基础类型 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
  order: number;
  description?: string;
  postCount: number;
  createdAt: string;
}

export interface TagListParams {
  page?: number; // 页码（默认1）
  pageSize?: number; // 每页条数（默认10）
  keyword?: string; // 搜索关键词（匹配标签名称）
}

export type TagListResponse = Response<{
  data: Tag[];
  pagination: PaginationParams;
}>;
