export interface User {
  shortId: string;
  email: string;
  nickname: string;
  avatar: string;
  gender: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  nickname: string;
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  expiresIn: number;
  tokenType?: string;
  // refreshToken: string;
  // refreshToken 从HttpOnly Cookie 中设置
}

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
  [key: string]: any;
}