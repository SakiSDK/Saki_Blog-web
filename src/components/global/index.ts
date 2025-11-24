/** ---------- 全局组件统一注册 ---------- */
// 导入全局组件
import Avatar from "./Avatar.vue";
import Icon from "./Icon.vue";
import FooterBar from "./FooterBar.vue";
import RightBar from "./RightBar.vue";
import TopBar from './TopBar.vue'
import type { App } from 'vue';
// import PageHeader from "./PageHeader.vue";

// 定义组件数组
const components = [
  Avatar,
  Icon,
  FooterBar,
  RightBar,
  TopBar,
  // PageHeader,
];

// 安装函数
const install = (app: App) => {
  // 遍历组件数组，注册全局组件
  components.forEach(component => {
    app.component(component.name as string, component);
  });
}

// 导出 install 函数和组件列表（方便按需引入）
export default {
  install,
  Avatar,
  Icon,
  FooterBar,
  RightBar,
  TopBar
}