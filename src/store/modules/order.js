/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
export default {
  namespaced: true,
  state: {
    brforeAddOrder: [],
    orderStorage: [], // 购物车商品集合
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
    // deleteOrder(state, index) {
    //   state.orderStorage.splice(index, 1)
    // },
    // deleteOrderColor(state, index, indexn) {
    //   state.orderStorage[index].goodsList.splice(indexn, 1)
    // },
    // deleteOrderSize(state, index, indexn, indexm) {
    //   state.orderStorage[index].goodsList[indexn].sizeList.splice(indexm, 1)
    // },
  },
  actions: {
  },
}
