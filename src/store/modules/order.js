/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
export default {
  namespaced: true,
  state: {
    brforeAddOrder: [],
    orderStorage: [], // 购物车商品集合
    cacheView: [],
    detailData: {},
    isStart: true,
  },
  getters: {
  },
  mutations: {
    addOrder(state, data) {
    	state.brforeAddOrder.push(data)
    },
    addOrderStorage(state, data) {
      // state.orderStorage.push(JSON.parse(data))
      state.orderStorage = JSON.parse(JSON.stringify(data))
    },
    cgDetail(state, data) {
      state.detailData = JSON.parse(JSON.stringify(data))
    },
    cgStart(state, data) {
      state.isStart = data
    },
  },
  actions: {
  },
}
