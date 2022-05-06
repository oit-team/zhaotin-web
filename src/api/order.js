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
// 订单详情
export function getOrdersite(params) {
  return post('/order/orderInfo/getOrderById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
