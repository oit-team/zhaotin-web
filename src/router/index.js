import Vue from 'vue'
import VueRouter from 'vue-router'
import Product from '@/views/Product/index'
import HomeView from '@/views/HomeView'
import Layout from '@/views/Layout/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [

    ],
  },
  {
    path: '/Product',
    component: Product,
  },
  {
    path: '/Order',
    component: () => import('@/views/order/index'),
  },
  {
    path: '/Manage',
    component: () => import('@/views/manage/index'),
  },
  {
    path: '/Seeting',
    component: () => import('@/views/seeting/index'),
  },
  {
    path: '/HomeView',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView'),
  },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

export default router
