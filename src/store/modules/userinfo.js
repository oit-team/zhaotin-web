import { reqLogin } from '@/api/user'

export default {
  namespaced: true,
  state: {
    userinfo: {},
  },
  getters: {
  },
  mutations: {
    getUserinfo(state, userinfo) {
      state.userinfo = userinfo
    },
  },
  actions: {
    async getMenus({ commit }, params) {
      const res = await reqLogin(params)
      commit('getUserinfo', res.body)
    },
  },
  modules: {
  },
}
