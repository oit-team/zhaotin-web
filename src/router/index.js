import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView'
import Layout from '@/views/Layout/index'
// import Order from '@/views/order/index'
// import customer from '@/views/customer/index'
// import System from '@/views/seeting/index'
import Center from '@/views/Center/index'
import GoodsDetails from '@/views/Center/components/goodsDetails'
import GoodsList from '@/views/Center/components/goodsList'
import ShopCart from '@/views/Center/components/shopCart'
import OrderGoods from '@/views/Center/components/orderGoods'
// import Nullpage from '@/views/Center/components/nullpage'
// import BaseSeeting from '@/views/BaseSeeting/index'
// import SystemRole from '@/views/seeting/components/role'
// import MenuList from '@/views/seeting/components/menuList'
// import BrandInteManage from '@/views/seeting/components/brandInteManage'
// import Style from '@/views/BaseSeeting/components/style'
// import StyleType from '@/views/BaseSeeting/components/styleType'
// import OtherCategoryList from '@/views/BaseSeeting/components/otherCategoryList'
// import AddRole from '@/views/seeting/components/addRole'
// import AddGoods from '@/views/BaseSeeting/components/addGoods'
// import AuthUsersByRoleId from '@/views/seeting/components/authUsersByRoleId'
// import AddMenu from '@/views/seeting/components/addMenu'
// import CustomerAccount from '@/views/BaseSeeting/components/customerAccount'
// import AddCustomer from '@/views/BaseSeeting/components/addCustomer'
// import AddUser from '@/views/seeting/components/addUser'
// import OrderMsg from '@/views/order/components/orderMsg'

Vue.use(VueRouter)
// 重复点击路由刷新页面， 并阻止报错
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  const history = this.currentRoute && this.currentRoute.fullPath
  if (to === history)
    window.location.reload()

  return VueRouterPush.call(this, to).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login/index'),
  },
  {
    // 积分商城
    path: '/integral',
    redirect: '/integral/goodsList',
    component: () => import('@/views/Integral'),
    children: [
      {
        path: '/integral/goodsList',
        component: () => import('@/views/Integral/components/goodsList'),
      },
      {
        path: '/integral/goodsDetails',
        component: () => import('@/views/Integral/components/goodsDetails'),
      },
      // 兑换 页面
      {
        path: '/integral/redeem',
        component: () => import('@/views/Integral/components/redeem'),
      },
    ],
  },
  {
    path: '/pointsManage',
    component: () => import('@/views/PointsManage'),
    children: [
      // 积分 商品 管理
      {
        path: '/pointsManage/goodsManage',
        component: () => import('@/views/PointsManage/components/goodsManage'),
      },
      // 积分商品 详情/新增/修改
      {
        path: '/pointsManage/addIntegralGoods',
        component: () => import('@/views/PointsManage/components/addIntegralGoods'),
      },
      // 积分订单管理
      {
        path: '/pointsManage/goodsOrder',
        component: () => import('@/views/PointsManage/components/goodsOrder'),
      },
      // 查看订单详情
      {
        path: '/pointsManage/orderInfo',
        component: () => import('@/views/PointsManage/components/orderInfo'),
      },
    ],
  },
  {
    // 商品中心
    path: '/styleCenter',
    component: Center,
    redirect: '/styleCenter/goodsList',
    children: [
      {
        path: '/styleCenter/goodsDetails',
        component: GoodsDetails,
      },
      {
        path: '/styleCenter/goodsList',
        component: GoodsList,
      },
      {
        path: '/styleCenter/shopCart',
        component: ShopCart,
      },
      {
        path: '/styleCenter/orderGoods',
        component: OrderGoods,
      },
    ],
    // component: () => import('@/views/Center/index'),
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
        path: '/basls/otherCategoryList/addDictionaryType',
        component: () => import('@/views/BaseSeeting/components/addDictionaryType'),
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
        path: '/basls/styleType/addDictionaryType',
        component: () => import('@/views/BaseSeeting/components/addDictionaryType'),
      },
      {
        path: '/basls/styleType/addCateGory',
        component: () => import('@/views/BaseSeeting/components/addCateGory'),
      },
      {
        path: '/basls/styleType/sizeInfo',
        component: () => import('@/views/BaseSeeting/components/sizeInfo'),
      },
      {
        path: '/basls/Integral',
        component: () => import('@/views/BaseSeeting/components/Integral'),
      },
      {
        path: '/basls/season',
        component: () => import('@/views/BaseSeeting/components/season'),
      },
      {
        path: '/basls/season/addSeason',
        component: () => import('@/views/BaseSeeting/components/addSeason'),
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

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && !sessionStorage.accessToken) {
    next('/')
  }
  next()
})

export default router
