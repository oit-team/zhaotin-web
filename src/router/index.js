import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView'
import Layout from '@/views/Layout/index'
import Order from '@/views/order/index'
import customer from '@/views/customer/index'
import System from '@/views/seeting/index'
import Center from '@/views/Center/index'
import BaseSeeting from '@/views/BaseSeeting/index'

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
    // 商品中心
    path: '/styleCenter',
    component: Center,
  },
  {
    // 订单管理
    path: '/order',
    component: Order,
  },
  {
    // 客户管理
    path: '/customer',
    component: customer,
  },
  {
    // 系统设置
    path: '/system',
    component: System,
  },
  {
    // 基础配置
    path: '/basls',
    component: BaseSeeting,
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
