import Vue from 'vue'
import Vuex from 'vuex'
// import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userinfo: {},
  },
  getters: {
  },
  mutations: {
    getUserinfo(state, userinfo) {
      state.userinfo = userinfo.resultList
      sessionStorage.setItem('userinfo', JSON.stringify(userinfo.resultList))
      localStorage.setItem('token', userinfo.accessToken)
    },
  },
})
export default store
