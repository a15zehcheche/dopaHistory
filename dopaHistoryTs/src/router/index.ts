import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import HomePage from '../views/HomePage.vue'
import indexPage from '../views/indexPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/pages'
  },
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: '/pages/',
    component: indexPage,
    children: [
      {
        path: '',
        redirect: '/pages/home'
      },
      {
        path: 'home',
        name:'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'comment',
        name:'comment',
        component: () => import('@/views/CommentPage.vue')
      },
      {
        path: 'statis',
        name:'statis',
        component: () => import('@/views/StatisPage.vue')
      },
      {
        path: 'user',
        name:'user',
        component: () => import('@/views/UserPage.vue')
      }
    ]
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
