import { post } from './index'
// 添加到购物车
export function addCart(params) {
  return post('/order/shoppingCart/insertShoppingCart', params, {
    mod: 'home',
    cmd: 40007,
  })
}
// 购物车查询
export function getShoppingCart(params) {
  return post('/order/shoppingCart/getShoppingCart', params, {
    mod: 'home',
    cmd: 40007,
  })
}
// 购物车删除商品
export function deleteShoppingCart(params) {
  return post('/order/shoppingCart/deleteShoppingCartStyle', params, {
    mod: 'home',
    // cmd: 40007,
  })
}
// 购物车  改变商品
export function changeShoppingCart(params) {
  return post('/order/shoppingCart/updateShoppingCart', params, {
    mod: 'home',
    // cmd: 40007,
  })
}
// 用户下单  收货地址
export function getOrderSite(params) {
  return post('/order/customerReceiving/getReceiving', params, {
    mod: 'home',
    cmd: 40007,
  })
}
