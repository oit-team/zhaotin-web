import { post } from './index'
// 订单查询
export function orderInfo(params) {
  return post('/order/orderInfo/getOrderList', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 订单详情
export function getOrderById(params) {
  return post('/order/orderInfo/getOrderById', params, {
    mod: 'home',
    cmd: 10008,
  })
}

// 修改订单
export function updateOrder(params) {
  return post('/order/orderInfo/updateOrder', params, {
    mod: 'home',
    cmd: 40007,
  })
}

// 查询订单修改记录
export function getOrderUpdateRecord(params) {
  return post('/order/orderInfo/getOrderUpdateRecord', params, {
    mod: 'home',
    cmd: 40007,
  })
}

// 查询积分商品订单详情
export function getOrderDetail(params) {
  return post('/order/integralShop/getOrderDetail', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 查询积分商品订单列表
export function getOrderList(params) {
  return post('/order/integralShop/getOrderList', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 积分商城 添加兑换记录
export function addExchangeRecord(params) {
  return post('/order/integralShop/addExchangeRecord', params, {
    mod: 'home',
    cmd: 100001,
    uuid: '1',
  })
}

// 积分商城 查看兑换记录
export function getOrderExchange(params) {
  return post('/order/integralShop/getOrderExchange', params, {
    mod: 'vue',
    uuid: null,
  })
}
