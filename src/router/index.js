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
    path: '/product',
    component: Product,
  },
  {
    path: '/order',
    component: () => import('@/views/order/index'),
  },
  {
    path: '/manage',
    component: () => import('@/views/manage/index'),
  },
  {
    path: '/seeting',
    component: () => import('@/views/seeting/index'),
  },
  {
    path: '/home-view',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView'),
  },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

export default router
