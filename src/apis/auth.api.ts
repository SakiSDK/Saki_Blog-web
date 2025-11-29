import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { post, get, del, put } from "@/utils/request.util";
import crypto from "crypto-js";
// import { useCaptchaStore } from "@/stores/useCaptchaStore"

export interface LoginData {
  email: string;
  password: string;
  captcha: string;
}
export interface RegisterData {
  username: string;
  password: string;
  email: string;
}
export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    created_at?: string;
    updated_at?: string;
  };
  accessToken: string;
  expiresIn: number;
  message?: string;
}

export class AuthApi {
  static async login(data: LoginData) {
    try {
      // 生成防重放和防篡改参数（对应后端接口要求）
      const timestamp = Date.now().toString(); // 时间戳
      const nonce = Math.random().toString(36).substring(2, 12); // 10位随机字符串
      // 签名规则：与后端Authorization-Signature一致（email+password+timestamp+nonce+服务器秘钥）
      const signStr = `${data.email}${data.password}${timestamp}${nonce}${config.signSecret}`;
      const signature = crypto.SHA256(signStr).toString(); // 生成sha256签名

      const captchaStore = useCaptchaStore();
      const { captchaKey } = storeToRefs(captchaStore);

      // 使用POST请求发送登录数据
      const res: any = await post<AuthResponse>("/api/v1/web/auth/login", {
        ...data,
        timestamp,
        nonce,
        signature,
        captcha_key: captchaKey.value,
        client: "web",
      });

      const { message, data: loginData } = res;

      // // 存储accessToken到本地存储
      // if (loginData.accessToken) {
      //     localStorage.setItem('accessToken', loginData.accessToken)
      //     // 设置token过期时间
      //     const expiresAt = Date.now() + loginData.expiresIn * 1000
      // }
      return loginData;
    } catch (error: any) {
      throw error;
    }
  }
  static async register(data: RegisterData) {
    try {
      // 使用POST请求发送注册数据
      const res: any = await post<AuthResponse>("/api/v1/web/auth/register", {
        ...data,
      });
      // 保存accessToken到本地存储
      // if (res.accessToken) {
      //     localStorage.setItem('accessToken', res.accessToken)
      //     // 设置token过期时间
      //     const expiresAt = Date.now() + res.expiresIn * 1000
      // }
      return res;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 登出
   * @returns
   */
  static async logout() {
    await get("/api/v1/web/auth/logout");
  }

  /**
   * 刷新token
   * @returns
   */
  static async refresh() {
    return await get("/api/v1/web/auth/refreshAccessToken");
  }

  /**
   * 获取验证码图片
   * @returns
   */
  static async getCaptcha() {
    return await get("/api/v1/web/auth/captcha", undefined, {
      responseType: "text",
      headers: {
        Accept: "image/svg+xml",
        Authorization: undefined,
      },
    });
  }

  /**
   * 获取用户基本信息
   */
  static async getUserProfile(shortId: string) {
    
  }
}
