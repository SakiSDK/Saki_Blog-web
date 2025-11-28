import { z } from "zod";

/** ---------- 通用正则表达式 ---------- */
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
export const errorMessage = {
  required: (field: string) => `${field}不能为空`,
  minLength: (field: string, length: number) => `${field}至少${length}个字符`,
  maxLength: (field: string, length: number) => `${field}最多${length}个字符`,
  pattern: (field: string, rule: string) => `${field}格式错误（${rule}）`,
  match: (field1: string, field2: string) => `${field1}与${field2}不一致`,
}

/** ---------- 基础字段验证schema ---------- */
/** 用户名验证（通用） */
export const usernameSchema = z.string()
  .trim()
  .min(3, errorMessage.minLength('用户名', 3))
  .max(20, errorMessage.maxLength('用户名', 20))
  .regex(regex.username, errorMessage.pattern('用户名', '字母开头，可包含字母、数字、下划线'))
  .refine(value => value.length > 0, errorMessage.required('用户名'));
/** 密码验证（通用） */
export const passwordSchema = z.string()
  .min(6, errorMessage.minLength('密码', 6))
  .max(20, errorMessage.maxLength('密码', 20))
  .regex(regex.password, errorMessage.pattern('密码', '至少包含字母和数字'))
  .refine(value => value.length > 0, errorMessage.required('密码'));
/** 邮箱验证（通用） */
export const emailSchema = z.string()
  .email(errorMessage.pattern('邮箱', '请输入有效的邮箱地址'))
  .refine(value => value.length > 0, errorMessage.required('邮箱'));

/** 手机号验证（通用） */
export const phoneSchema = z.string()
  .regex(regex.phone, errorMessage.pattern('手机号', '请输入有效的手机号'))
  .refine(value => value.length > 0, errorMessage.required('手机号'));

/** 验证码验证（通用） */
export const codeSchema = z.string()
  .regex(regex.code, errorMessage.pattern('验证码', '请输入6位数字验证码'))
  .refine(value => value.length > 0, errorMessage.required('验证码'));

/** 中文名称验证（通用） */
export const chineseNameSchema = z.string()
  .min(2, errorMessage.minLength('姓名', 2))
  .max(10, errorMessage.maxLength('姓名', 10))
  .regex(regex.chinese, errorMessage.pattern('姓名', '请输入中文'))
  .refine(value => value.length > 0, errorMessage.required('姓名'));



/** ---------- 业务表单Schema ---------- */
/** 登录表单 Schema */
export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  remember: z.boolean().optional().default(false), // 记住我（可选）
});
/** 注册表单 Schema */
export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema, // 复用密码验证规则
  email: emailSchema,
  code: codeSchema,
  agree: z.boolean().refine(agree => agree === true, '请同意用户协议和隐私政策'), // 同意协议
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
// 表单类型
export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterFormType = z.infer<typeof registerSchema>;
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

// 请求参数类型
export type PaginationParamsType = z.infer<typeof paginationSchema>;
export type SortParamsType = z.infer<typeof sortSchema>;
export type QueryParamsType = z.infer<typeof querySchema>;
