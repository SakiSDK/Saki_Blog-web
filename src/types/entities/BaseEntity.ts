// 基础实体类型
export interface BaseEntity {
  id: number | string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string
}