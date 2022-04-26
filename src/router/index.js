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
import AuthUsersByRoleId from '@/views/seeting/components/authUsersByRoleId'
import AddMenu from '@/views/seeting/components/addMenu'
import CustomerAccount from '@/views/BaseSeeting/components/customerAccount'
import AddCustomer from '@/views/BaseSeeting/components/addCustomer'
import AddUser from '@/views/seeting/components/addUser'
import OrderInfo from '@/views/order/components/orderInfo'

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
    children: [{
      path: '/order/orderInfo',
      component: OrderInfo,
    }],
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
        path: '/system/menuList/AddMneu',
        component: AddMenu,
      },
      {
        path: '/system/brandInteManage',
        component: BrandInteManage,
      },
      {
        path: '/system/addRole',
        component: AddRole,
      },
      {
        path: '/system/authUsersByRoleId',
        component: AuthUsersByRoleId,
      },
      {
        path: '/system/addUser',
        component: AddUser,
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
      {
        path: '/basls/customerAccount',
        component: CustomerAccount,
      },
      {
        path: '/basls/customerAccount',
        component: CustomerAccount,
      },
      {
        path: '/basls/customerAccount/addCustomer',
        component: AddCustomer,
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
