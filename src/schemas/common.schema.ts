import { z } from "zod";
import { zBoolean, zInteger, zPageNum, zPageSize, zStr } from './base.schema';

/** ---------- 通用正则表达式 ---------- */
/** 正则通用 */
export const regex = {
  // 用户名：字母开头，可包含字母、数字、下划线，长度 2-20 个字符
  username: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
  // 密码：至少包含字母和数字，6-20位
  password: /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/,
  // 手机号：国内手机号
  phone: /^1[3-9]\d{9}$/,
  // 邮箱：通用邮箱格式
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 验证码：6位数字
  code: /^\d{6}$/,
  // 中文：纯中文或包含中文
  chinese: /^[\u4e00-\u9fa5]+$/,
}



/** ---------- 通用错误提示 ---------- */
/** 通用错误提示 */
export const errorMessage = {
  required: (field: string) => `${field}不能为空`,
  minLength: (field: string, length: number) => `${field}至少${length}个字符`,
  maxLength: (field: string, length: number) => `${field}最多${length}个字符`,
  pattern: (field: string, rule: string) => `${field}格式错误（${rule}）`,
  match: (field1: string, field2: string) => `${field1}与${field2}不一致`,
}



/** ---------- 基础字段验证schema ---------- */
/** id通用验证 */
export const idSchema = zStr
  .min(1, errorMessage.required('ID'))
  .refine(value => value.length > 0, errorMessage.required('ID'));

/** slug别名验证 */
export const slugSchema = zStr
  .min(2, errorMessage.required('别名'))
  .max(50, errorMessage.maxLength('别名', 50))
  .regex(regex.username, errorMessage.pattern('别名', '字母开头，可包含字母、数字、下划线'))
  .refine(value => value.length > 0, errorMessage.required('别名'));

/** 用户名验证（通用） */
export const usernameSchema = zStr
  .min(3, errorMessage.minLength('用户名', 3))
  .max(20, errorMessage.maxLength('用户名', 20))
  .regex(regex.username, errorMessage.pattern('用户名', '字母开头，可包含字母、数字、下划线'))
  .refine(value => value.length > 0, errorMessage.required('用户名'));

/** 密码验证（通用） */
export const passwordSchema = zStr
  .min(6, errorMessage.minLength('密码', 6))
  .max(20, errorMessage.maxLength('密码', 20))
  .regex(regex.password, errorMessage.pattern('密码', '至少包含字母和数字'))
  .refine(value => value.length > 0, errorMessage.required('密码'));

/** 邮箱验证（通用） */
export const emailSchema = zStr
  .email(errorMessage.pattern('邮箱', '请输入有效的邮箱地址'))
  .refine(value => value.length > 0, errorMessage.required('邮箱'));

/** 手机号验证（通用） */
export const phoneSchema = zStr
  .regex(regex.phone, errorMessage.pattern('手机号', '请输入有效的手机号'))
  .refine(value => value.length > 0, errorMessage.required('手机号'));

/** 验证码验证（通用） */
export const codeSchema = zStr
  .regex(regex.code, errorMessage.pattern('验证码', '请输入6位数字验证码'))
  .refine(value => value.length > 0, errorMessage.required('验证码'));

/** 中文名称验证（通用） */
export const chineseNameSchema = zStr
  .min(2, errorMessage.minLength('姓名', 2))
  .max(10, errorMessage.maxLength('姓名', 10))
  .regex(regex.chinese, errorMessage.pattern('姓名', '请输入中文'))
  .refine(value => value.length > 0, errorMessage.required('姓名'));


/** ---------- 通用验证字段 ---------- */
/**
 * 2. 分页信息 Schema（匹配后端 pagination 结构）
 */
export const PaginationSchema = z.object({
  page: zPageNum,
  pageSize: zPageSize,
  total: zInteger.describe('总记录数'),
  totalPages: zInteger.describe('总页数'),
  hasNext: zBoolean.describe('是否有下一页'),
  hasPrev: zBoolean.describe('是否有上一页'),
});



/** ---------- 业务表单Schema ---------- */
/** 登录表单 Schema */
export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  remember: zBoolean.optional().default(false).describe('是否记住登录状态'), // 记住我（可选）
});

/** 注册表单 Schema */
export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema, // 复用密码验证规则
  email: emailSchema,
  code: codeSchema,
  agree: zBoolean.refine(agree => agree === true, '请同意用户协议和隐私政策').describe('是否同意用户协议和隐私政策'), // 同意协议
})
  // 验证两次密码一致
  .refine(data => data.password === data.confirmPassword, {
    message: errorMessage.match('密码', '确认密码'),
    path: ['confirmPassword'], // 错误提示定位到确认密码字段
  });

/** 忘记密码表单 Schema */
export const forgotPasswordSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  code: codeSchema,
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
})
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: errorMessage.match('新密码', '确认新密码'),
    path: ['confirmNewPassword'],
  });
/** 修改密码表单 Schema */
export const changePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
})
  .refine(data => data.newPassword !== data.oldPassword, {
    message: '新密码不能与原密码相同',
    path: ['newPassword'],
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: errorMessage.match('新密码', '确认新密码'),
    path: ['confirmNewPassword'],
  });


/** ---------- 通用请求参数Schema ---------- */
/** 分页查询参数 Schema */
export const paginationSchema = z.object({
  page: z.number().int().min(1, '页码不能小于1').default(1),
  pageSize: z.number().int().min(1, '每页条数不能小于1').max(100, '每页条数不能超过100').default(10),
  keyword: z.string().optional(), // 搜索关键词（可选）
});

/** 排序参数 Schema */
export const sortSchema = z.object({
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/** 通用查询参数 Schema（分页+排序） */
export const querySchema = paginationSchema.merge(sortSchema);

/** ---------- 导出 类型 ---------- */
/** 登录表单类型 */
export type LoginFormType = z.infer<typeof loginSchema>;
/** 注册表单类型 */
export type RegisterFormType = z.infer<typeof registerSchema>;
/** 忘记密码表单类型 */
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
/** 修改密码表单类型 */
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

/** 分页查询参数类型 */
export type PaginationParamsType = z.infer<typeof paginationSchema>;
/** 排序参数类型 */
export type SortParamsType = z.infer<typeof sortSchema>;
/** 通用查询参数类型 */
export type QueryParamsType = z.infer<typeof querySchema>;

/** 分页类型 */
export type Pagination = z.infer<typeof PaginationSchema>;