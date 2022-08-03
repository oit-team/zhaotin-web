/* eslint-disable import/order */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from '@/locale'
import Plyr from 'plyr'
import ElementUI from 'element-ui'
import { TablePage } from '@oit/element-ui-extend'
import 'tailwindcss/tailwind.css'
import './plugins'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(TablePage, {
  setFields() {
    if (sessionStorage.headTitString) {
      return JSON.parse(sessionStorage.headTitString)
    }
  },
})

const player = new Plyr('#player')
// router.beforeEach((to, from, next) => {
//   // 判断要去的路由有没有requiresAuth,为true表示必须要登录才可进入的页面
//   if (to.meta.requiresAuth) {
//     if (sessionStorage.userId) { // 有userId，正常执行流程，该去哪去哪
//       // 判断要进入的页面该用户是否可访问
//       // console.log('to.path===', to.path)
//       if (to.path !== '/' && to.path !== '/index') {
//         const toPath = to.path.split('/')[1]
//         // console.log("toPath===",toPath);
//         // console.log("sessionStorage.homeMenuPathArr===",sessionStorage.homeMenuPathArr)
//         // console.log(sessionStorage.homeMenuPathArr.includes(toPath));
//         if (sessionStorage.homeMenuPathArr.includes(toPath)) {
//           next()
//         } else {
//           ElementUI.Message({
//             message: '暂无访问权限',
//             type: 'warning',
//             duration: '3000',
//           })
//         }
//       } else {
//         next()
//       }

//       next()
//     } else { // 无userId,跳转到登录页面
//       next({
//         path: '/login',
//         query: {
//           // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
//           redirect: to.fullPath,
//         },
//       })
//     }
//   } else {
//     next()
//   }
// })

router.afterEach(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop !== 0)
    window.scrollTo('0', '0')
})

Vue.use(VueQuillEditor)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  player,
  ElementUI,
  render: h => h(App),
}).$mount('#app')
