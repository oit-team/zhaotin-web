/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
export default {
  namespaced: true,
  state: {
    menuOperation: '', // 菜单按钮权限
  },
  getters: {
  },
  mutations: {
    addMmenuOperation(state, data) {
      state.menuOperation = data
    },
  },
  actions: {
  },
}
