import Vue from 'vue'
import VueRouter from 'vue-router'
import Product from '@/views/Product/index'
import HomeView from '@/views/HomeView'
import Layout from '@/views/Layout/index'
import Task from '@/views/order/index'
import Statistics from '@/views/manage/index'
import testList1 from '@/views/seeting/index'

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
    path: '/index',
    component: Product,
  },
  {
    path: '/task',
    component: Task,
  },
  {
    path: '/statistics',
    component: Statistics,
  },
  {
    path: '/testList1',
    component: testList1,
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
