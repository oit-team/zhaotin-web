/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
export default {
  namespaced: true,
  state: {
    brforeAddOrder: [],
  },
  getters: {
  },
  mutations: {
    addOrder(state, info) {
    	state.brforeAddOrder.push(info)
    },
  },
  actions: {
  },
}
