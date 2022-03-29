import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView'
import Layout from '../views/Layout/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
  },
  {
    path: '/HomeView',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/index'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
