import Home from '../views/Home.vue';
import Aboutme from '../views/Aboutme.vue';
import ArticleDetail from '@/views/ArticleDetail.vue';
import type { RouteRecordRaw } from 'vue-router';
import ArticleTags from '@/views/ArticleTags.vue';
import ArticleCategories from '@/views/ArticleCategories.vue';
import NotFound from '@/views/NotFound.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Album from '@/views/Album.vue';
import PhotoWaterFall from '@/views/PhotoWaterFall.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/aboutme',
    name: 'Aboutme',
    component: Aboutme
  },
  {
    path: '/album',
    name: 'Album',
    component: Album,
  },
  {
    path: '/album/:slug',
    name: 'WaterFall',
    component: PhotoWaterFall,
  },
  {
    path: '/article/tag',
    name: 'ArticleTag',
    component: ArticleTags
  },
  {
    path: '/article/category',
    name: 'ArticleCategory',
    component: ArticleCategories
  },
  {
    path: '/article/:shortId',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  // 其他未定义的路由，自动跳转到notfound页
  {
    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: NotFound,
  },
]

export default routes;