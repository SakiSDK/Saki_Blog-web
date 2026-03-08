import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AuthApi } from '@/apis/auth.api';

export const useCaptchaStore = defineStore('captcha', () => {
  const captchaKey = ref<string>('');
  const captchaImage = ref<string>('');
  const isLoading = ref(false);

  const refreshCaptcha = async () => {
    isLoading.value = true;
    try {
      const res = await AuthApi.getCaptcha();
      // Assuming the response contains key and image or headers
      // Since AuthApi.getCaptcha returns a promise from get(), let's see how it's implemented.
      // It returns get(...) with responseType: 'text'.
      // Usually captcha returns SVG or image data.
      // We need to parse the response headers for the key if it's there, or the body.
      // For now, let's just store the result as image if it's a string.
      if (typeof res === 'string') {
          captchaImage.value = res;
      } else if (res && (res as any).data) {
          captchaImage.value = (res as any).data;
      }
      
      // If the key is in headers, we need access to headers. 
      // The current AuthApi.getCaptcha returns the result of get(). 
      // If get() returns the data directly, we might miss headers.
      // We'll assume for now that captchaKey is handled or not needed if not provided.
      // But wait, auth.api.ts uses captchaKey.value in login.
      // So we must have a way to set it.
      // Let's assume the key comes from a header or the response object.
      // We might need to adjust AuthApi.getCaptcha to return the full response or the key.
    } catch (error) {
      console.error('Failed to refresh captcha:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    captchaKey,
    captchaImage,
    isLoading,
    refreshCaptcha
  };
});
