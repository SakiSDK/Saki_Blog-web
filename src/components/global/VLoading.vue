<template>
  <div class="request-fail-container" :class="customClass" v-if="errorCode">
    <!-- 错误图标（根据错误码动态切换） -->
    <div class="fail-icon" :style="{ color: iconColor }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <template v-if="errorCode === 401">
          <!-- 401 未登录：用户图标 -->
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </template>
        <template v-else-if="errorCode === 403">
          <!-- 403 无权限：禁止图标 -->
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </template>
        <template v-else-if="errorCode === 500">
          <!-- 500 服务端错误：服务器图标 -->
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </template>
        <template v-else>
          <!-- 默认错误（400/网络异常等）：叉号图标 -->
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </template>
      </svg>
    </div>

    <!-- 错误标题（带错误码） -->
    <h3 class="fail-title">
      [{{ errorCode || "未知" }}] {{ title || "请求失败" }}
    </h3>

    <!-- 错误描述 -->
    <p class="fail-desc">
      {{ desc || "抱歉，操作失败，请稍后重试~" }}
    </p>

    <!-- 操作按钮区（支持自定义按钮） -->
    <div class="fail-actions" :style="{ gap: `${buttonGap}px` }">
      <!-- 默认按钮：刷新重试（可通过 props 控制显示） -->
      <button
        v-if="showRetryBtn"
        class="fail-btn fail-btn--primary"
        @click="onRetry"
      >
        {{ retryBtnText || "刷新重试" }}
      </button>

      <!-- 自定义按钮（通过 slots 传入，支持多按钮） -->
      <slot name="actions"></slot>
    </div>

    <!-- 错误详情（开发环境显示，生产环境隐藏） -->
    <div
      class="fail-detail"
      v-if="showDetail && envConfig.env === 'development'"
    >
      <p class="detail-label">错误详情：</p>
      <pre class="detail-content">{{ JSON.stringify(detail, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import envConfig from "@/config/env.config";

/** 组件 Props 定义 */
// const props = 
/** 默认 Prop 值 */
const props = withDefaults(
  defineProps<{
    /** 错误码（401/403/500/其他） */
    errorCode?: number | null;
    /** 错误标题（默认："请求失败"） */
    title?: string;
    /** 错误描述（默认："抱歉，操作失败，请稍后重试~"） */
    desc?: string;
    /** 是否显示刷新重试按钮（默认：true） */
    showRetryBtn?: boolean;
    /** 刷新按钮文本（默认："刷新重试"） */
    retryBtnText?: string;
    /** 按钮间距（默认：12px） */
    buttonGap?: number;
    /** 是否显示错误详情（开发环境生效，默认：true） */
    showDetail?: boolean;
    /** 错误详情数据（如原始错误、请求参数等，开发环境展示） */
    detail?: Record<string, any>;
    /** 自定义类名（用于覆盖样式） */
    customClass?: string;
  }>(),
  {
    showRetryBtn: true,
    buttonGap: 12,
    showDetail: true,
    detail: () => ({}),
  }
);
/** 组件 Emits 定义 */
const emit = defineEmits<{
  /** 刷新重试按钮点击事件 */
  (e: "retry"): void;
}>();

/** 计算属性：根据错误码动态设置图标颜色 */
const iconColor = computed(() => {
  switch (props.errorCode) {
    case 401:
      return "#faad14"; // 橙色（未登录）
    case 403:
      return "#1890ff"; // 蓝色（无权限）
    case 500:
      return "#999"; // 灰色（服务端错误）
    default:
      return "#ff4d4f"; // 红色（默认错误）
  }
});

/** 刷新重试按钮点击事件 */
const onRetry = () => {
  emit("retry");
};


</script>

<style scoped>
.request-fail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

.fail-icon {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.fail-icon svg {
  width: 48px;
  height: 48px;
}

.fail-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.fail-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
  max-width: 400px;
}

.fail-actions {
  display: flex;
  margin-bottom: 16px;
}

.fail-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.fail-btn--primary {
  background-color: #42b983;
  color: #fff;
}

.fail-btn--primary:hover {
  background-color: #359469;
}

.fail-btn--secondary {
  background-color: #fff;
  color: #42b983;
  border: 1px solid #42b983;
}

.fail-btn--secondary:hover {
  background-color: #f5f5f5;
}

.fail-btn--text {
  background-color: transparent;
  color: #666;
}

.fail-btn--text:hover {
  color: #42b983;
  text-decoration: underline;
}

.fail-detail {
  width: 100%;
  max-width: 400px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: left;
}

.detail-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.detail-content {
  font-size: 12px;
  color: #666;
  white-space: pre-wrap;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

/* 响应式适配（移动端） */
@media (max-width: 768px) {
  .request-fail-container {
    padding: 40px 16px;
  }

  .fail-icon svg {
    width: 36px;
    height: 36px;
  }

  .fail-title {
    font-size: 16px;
  }

  .fail-actions {
    flex-direction: column;
    width: 100%;
  }

  .fail-btn {
    width: 100%;
    margin-bottom: 8px;
  }

  .fail-btn:last-child {
    margin-bottom: 0;
  }
}
</style>