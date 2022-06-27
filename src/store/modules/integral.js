export default {
  namespaced: true,
  state: {
    brforeAddOrder: [],
    cacheView: [],
    orderStorage: {},
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
