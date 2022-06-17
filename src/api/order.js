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
