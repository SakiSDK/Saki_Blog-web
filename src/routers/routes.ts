import Home from '../views/Home.vue';
import Aboutme from '../views/Aboutme.vue';
import type { RouteRecordRaw } from 'vue-router';

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
]

export default routes;

// import { RouteRecordRaw } from 'vue-router'
// import Home from '@/views/Home.vue'
// import Auth from '@/views/Auth.vue'
// import ArticleDetail from '@/views/ArticleDetail.vue'
// import Album from '@/views/Album.vue'
// import { usePostStore } from '@/stores/usePostStore'
// import { storeToRefs } from 'pinia';
// import { useLoadingStore } from '@/stores/useLoadingStore';
// import Account from '@/views/Account.vue'


// const routes: RouteRecordRaw[] = [
//     {
//         path: '/',
//         name: 'home',
//         component: Home,
//     },
//     {
//         path: '/auth',
//         name: 'auth',
//         component: Auth
//     },
//     {
//         path: '/article',
//         name: 'article',
//         component: ArticleDetail
//     },
//     {
//         path: '/album',
//         name: 'album',
//         component: Album,
//     },
//     {
//         path: '/account',
//         name: 'account',
//         component: Account,
//         beforeEnter: async (to, from, next) => { 
//             const token = localStorage.getItem('accessToken')
//             const userStore = useUserStore()
//             if (token) {
//                 next()
//             } else {
//                 next('/auth')
//             }
//         }
//     },
//     {
//         path: '/post/:shortId',
//         name: 'postDetail',
//         component: () => import('@/views/ArticleDetail.vue'),
//         beforeEnter: async (to, from, next) => {
//             const postStore = usePostStore()
//             const shortId = to.params.shortId as string
//             try {
//                 await postStore.getPostDetail(shortId)

//                 const { currentPost, postLoading } = storeToRefs(postStore);
//                 const { pageLoading } = storeToRefs(useLoadingStore())
//                 pageLoading.value = false
//                 pageLoading.value = true

//                 postLoading.value = true
//                 postLoading.value = false

//                 if (currentPost.value) {
//                     next()
//                 } else {
//                     next('/')
//                 }
//             } catch (error) {
//                 next('/')
//             }
//         }
//     }
//     // 动态创建路由，由useAppInit完成
// ]

// export default routes