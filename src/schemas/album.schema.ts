import { z } from 'zod';
import { PaginationSchema, ResponseSchema, zId, zInteger, zPageNum, zPageSize, zStr } from './base.schema';

/** ---------- 基础字段 ---------- */
/** 相册slug */
const albumSlugSchema = zStr.describe("相册slug");
/** 相册名 */
const albumNameSchema = zStr.describe("相册名");
/** 相册标题 */
const albumTitleSchema = zStr.describe("相册标题");
/** 相册封面 */
const albumCoverSchema = z.string().describe("相册封面").nullable().optional();
/** 相册描述 */
const albumDescriptionSchema = z.string().describe("相册描述").nullable().optional();

/** 照片宽度 */
const photoWidthSchema = zInteger.describe('照片宽度').nullable().optional();
/** 照片高度 */
const photoHeightSchema = zInteger.describe('照片高度').nullable().optional();
/** 照片原图 */
const photoOriginalSchema = zStr.describe('照片原图');
/** 照片压缩图 */
const photoThumbnailSchema = z.string().describe('照片压缩图').nullable().optional();


/** 相册内容信息 */
export const AlbumSchema = z.object({
  slug: albumSlugSchema,
  name: albumNameSchema,
  title: albumTitleSchema,
  cover: albumCoverSchema,
  description: albumDescriptionSchema,
});

/** 相册简要信息（用于详情页，部分字段可选） */
export const AlbumBriefSchema = AlbumSchema.omit({
  cover: true,
})

/** 照片内容信息 */
export const PhotoSchema = z.object({
  width: photoWidthSchema,
  height: photoHeightSchema,
  originalUrl: photoOriginalSchema,
  thumbnailUrl: photoThumbnailSchema,
});


/** ---------- 列表类型 ---------- */
/** 相册列表类型 */
export const AlbumListSchema = z.object({
  list: z.array(AlbumSchema).describe('相册列表'),
  pagination: PaginationSchema.describe('分页信息'),
})

/** 相册详情类型 */
export const AlbumDetailSchema = z.object({
  album: AlbumBriefSchema.describe('相册信息').nullable().optional(),
  list: z.array(PhotoSchema).describe('照片列表'),
  pagination: PaginationSchema.describe('分页信息'),
})



/** ---------- 相册列表完整相应schema ---------- */
/** 相册列表返回值信息 */
export const AlbumListResponseSchema = ResponseSchema(AlbumListSchema);

/** 相册详情返回值信息 */
export const AlbumDetailResponseSchema = ResponseSchema(AlbumDetailSchema);



/** ---------- 相册列表请求参数封装 ---------- */
/** 相册列表请求参数 */
export const AlbumListQuerySchema = z.object({
  page: zPageNum,
  pageSize: zPageSize.default(10),
})
/** 相册详情请求参数 */
export const AlbumDetailQuerySchema = z.object({
  page: zPageNum,
  pageSize: zPageSize.default(10),
})



/** ---------- 类型推导 ---------- */
/** 相册类型 */
export type Album = z.infer<typeof AlbumSchema>;
/** 照片类型 */
export type Photo = z.infer<typeof PhotoSchema>;


/** 相册列表请求参数类型 */
export type AlbumListQuery = z.infer<typeof AlbumListQuerySchema>;
/** 相册详情请求参数类型 */
export type AlbumDetailQuery = z.infer<typeof AlbumDetailQuerySchema>;



/** 相册列表返回值类型 */
export type AlbumListResponse = z.infer<typeof AlbumListResponseSchema>;
/** 相册详情返回值类型 */
export type AlbumDetailResponse = z.infer<typeof AlbumDetailResponseSchema>;