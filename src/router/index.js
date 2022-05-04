import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView'
import Layout from '@/views/Layout/index'
// import Order from '@/views/order/index'
// import customer from '@/views/customer/index'
// import System from '@/views/seeting/index'
// import Center from '@/views/Center/index'
// import BaseSeeting from '@/views/BaseSeeting/index'
// import SystemRole from '@/views/seeting/components/role'
// import MenuList from '@/views/seeting/components/menuList'
// import BrandInteManage from '@/views/seeting/components/brandInteManage'
// import Style from '@/views/BaseSeeting/components/style'
// import StyleType from '@/views/BaseSeeting/components/styleType'
// import OtherCategoryList from '@/views/BaseSeeting/components/otherCategoryList'
// import AddRole from '@/views/seeting/components/addRole'
// import AuthUsersByRoleId from '@/views/seeting/components/authUsersByRoleId'
// import CustomerAccount from '@/views/BaseSeeting/components/customerAccount'
// import OrderMsg from '@/views/order/components/orderMsg'
// import SizeInfo from '@/views/BaseSeeting/components/sizeInfo'

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
    component: () => import('@/views/Center/index'),
  },
  {
    // 订单管理
    path: '/order',
    component: () => import('@/views/order/index'),
  },
  {
    path: '/order/orderMsg',
    component: () => import('@/views/order/components/orderMsg'),
  },
  {
    // 客户管理
    path: '/customer',
    component: () => import('@/views/customer/index'),
  },
  {
    // 系统设置
    path: '/system',
    component: () => import('@/views/seeting/index'),
    children: [
      {
        path: '/system/role',
        component: () => import('@/views/seeting/components/role'),
      },
      {
        path: '/system/menuList',
        component: () => import('@/views/seeting/components/menuList'),
      },
      {
        path: '/system/menuList/AddMneu',
        component: () => import('@/views/seeting/components/addMenu'),
      },
      {
        path: '/system/brandInteManage',
        component: () => import('@/views/seeting/components/brandInteManage'),
      },
      {
        path: '/system/addRole',
        component: () => import('@/views/seeting/components/addRole'),
      },
      {
        path: '/system/authUsersByRoleId',
        component: () => import('@/views/seeting/components/authUsersByRoleId'),
      },
      {
        path: '/system/addUser',
        component: () => import('@/views/seeting/components/addUser'),
      },
    ],
  },
  {
    // 基础配置
    path: '/basls',
    component: () => import('@/views/BaseSeeting/index'),
    children: [
      {
        path: '/basls/style',
        component: () => import('@/views/BaseSeeting/components/style'),
      },
      {
        path: '/basls/styleType',
        component: () => import('@/views/BaseSeeting/components/styleType'),
      },
      {
        path: '/basls/otherCategoryList',
        component: () => import('@/views/BaseSeeting/components/otherCategoryList'),
      },
      {
        path: '/basls/style/addGoods',
        component: () => import('@/views/BaseSeeting/components/addGoods'),
      },
      {
        path: '/basls/customerAccount',
        component: () => import('@/views/BaseSeeting/components/customerAccount'),
      },
      {
        path: '/basls/customerAccount/addCustomer',
        component: () => import('@/views/BaseSeeting/components/addCustomer'),
      },
      {
        path: '/basls/styleType/addCateGory',
        component: () => import('@/views/BaseSeeting/components/addCateGory'),
      },
      {
        path: '/basls/styleType/sizeInfo',
        component: () => import('@/views/BaseSeeting/components/sizeInfo'),
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
