/** ---------- 全局组件统一注册 ---------- */
// 导入全局组件
import Avatar from "./Avatar.vue";
import Icon from "./Icon.vue";
import Footer from "./Footer.vue";
import RightBar from "./RightBar.vue";
import Top from './Top.vue'

// 定义组件数组
const components = [
  Avatar,
  Icon,
  Footer,
  RightBar,
  Top
];

// 安装函数
const install = (app: any) => {
  // 遍历组件数组，注册全局组件
  components.forEach(component => {
    app.component(component.name, component);
  });
}

// 导出 install 函数和组件列表（方便按需引入）
export default {
  install,
  Avatar,
  Icon,
  Footer,
  RightBar,
  Top
}