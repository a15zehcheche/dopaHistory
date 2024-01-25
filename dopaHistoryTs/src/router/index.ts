import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('@/views/CommentPage.vue')
  },
  {
    path: '/statis',
    name: 'statis',
    component: () => import('@/views/StatisPage.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/UserPage.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/user/SettingPage.vue'),

  },
  {
    path: '/dopaCase',
    name: 'dopaCase',
    component: () => import('@/views/user/DopaCasePage.vue'),
  },
  {
    path: '/comment/detail/:id',
    name: 'CommentDetail',
    component: () => import('@/components/comment/commentDetail.vue'),
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
