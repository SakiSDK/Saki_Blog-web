// 应用配置类型
export interface Config {
  name: string
  version: string
  apiBaseUrl: string
  env: 'development' | 'production' | 'test'
}

// 分页参数
export interface PaginationParams {
  pageNum: number
  pageSize: number
  total: number
  totalPages: number
}

// 分页响应
export interface PaginationResponse<T> {
  data: T[]
  pagination: PaginationParams
}

// 通用响应格式
export interface Response<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 错误类型
export interface Error {
  code: number | string
  message: string
  details?: any
  timestamp?: Date
}
