import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView'
import Layout from '@/views/Layout/index'
import Order from '@/views/order/index'
import customer from '@/views/customer/index'
import System from '@/views/seeting/index'
import Center from '@/views/Center/index'
import BaseSeeting from '@/views/BaseSeeting/index'
import SystemRole from '@/views/seeting/components/role'
import MenuList from '@/views/seeting/components/menuList'
import BrandInteManage from '@/views/seeting/components/brandInteManage'
import Style from '@/views/BaseSeeting/components/style'
import StyleType from '@/views/BaseSeeting/components/styleType'
import OtherCategoryList from '@/views/BaseSeeting/components/otherCategoryList'
import AddRole from '@/views/seeting/components/addRole'
import AddGoods from '@/views/BaseSeeting/components/addGoods'

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
    children: [
      {
        path: '/system/role',
        component: SystemRole,
      },
      {
        path: '/system/menuList',
        component: MenuList,
      },
      {
        path: '/system/brandInteManage',
        component: BrandInteManage,
      },
      {
        path: '/system/addRole',
        component: AddRole,
      },
    ],
  },
  {
    // 基础配置
    path: '/basls',
    component: BaseSeeting,
    children: [
      {
        path: '/basls/style',
        component: Style,
      },
      {
        path: '/basls/styleType',
        component: StyleType,
      },
      {
        path: '/basls/otherCategoryList',
        component: OtherCategoryList,
      },
      {
        path: '/basls/style/addGoods',
        component: AddGoods,
      },
    ],
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
