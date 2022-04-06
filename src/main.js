/* eslint-disable import/order */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from '@/locale'

import 'tailwindcss/tailwind.css'

import './plugins'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
