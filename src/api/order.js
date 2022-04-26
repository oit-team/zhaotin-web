import { post } from './index'
// 订单查询
export function orderInfo(params) {
  return post('/order/orderInfo/getOrderList', params, {
    mod: 'home',
    cmd: 10008,
  })
}
