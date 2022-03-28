import Vue from 'vue'
import Element from 'element-ui'
import '@/styles/element-ui.scss'
import i18n from '@/locale'

// 全局注册Element组件库
Vue.use(Element, {
  i18n: i18n.t.bind(i18n),
})
