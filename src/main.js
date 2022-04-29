/* eslint-disable import/order */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from '@/locale'
import Plyr from 'plyr'

import 'tailwindcss/tailwind.css'

import './plugins'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const player = new Plyr('#player')
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  player,
  render: (h) => h(App),
}).$mount('#app')
