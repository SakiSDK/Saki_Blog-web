import type { BaseEntity } from './BaseEntity';

// 用户角色
type UserRole = 'admin' | 'user';

// 用户状态
type UserStatus = 'active' | 'inactive';

export interface User extends BaseEntity {
  shortId: string;
  nickname: string;
  avatar: string;
  bio: string;
  created_at: string;
  role: string;
}