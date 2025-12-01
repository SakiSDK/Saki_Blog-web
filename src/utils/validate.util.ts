import type { z } from "zod";

export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("❌ Request 参数校验失败:", result.error);
    throw new Error("请求参数格式不正确");
  }
  return result.data;
};

export const validateResponse = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("❌ Response 数据校验失败:", result.error);
    throw new Error("服务端返回异常数据格式");
  }
  return result.data;
};