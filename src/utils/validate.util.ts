import type z from "zod";


/** ---------- 通用验证工具函数 ---------- */
/**
 * 验证数据并返回格式化的错误信息
 * @param schema Zod Schema
 * @param data 待验证数据
 * @returns 验证结果 { success: boolean, errors: Record<string, string> }
 */
export const validateData = <T extends z.ZodSchema<any>>(
  schema: T,
  data: unknown
): {
  success: boolean;
  errors: Record<string, string>;
  data?: z.infer<T>;
} => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      errors: {},
      data: result.data,
    };
  }
  
  // 格式化错误信息：{ field: message }
  const errors = result.error.issues.reduce((acc, issue) => {
    const field = issue.path.join('.'); // 支持嵌套字段
    acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);
  
  return {
    success: false,
    errors,
  };
};

/**
 * 部分验证（仅验证存在的字段）
 * @param schema Zod Schema
 * @param data 待验证数据
 * @returns 验证结果
 */
export const validatePartialData = <T extends z.ZodObject<any>>(
  schema: T,
  data: unknown
) => {
  return validateData(schema.partial(), data);
};