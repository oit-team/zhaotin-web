import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 获取商品数据
export function reqGetProductList(params) {
  return post('/style/getStyleList', params)
}
// 获取菜单数据
export function reqGetUser(params) {
  return post('/system/menu/getTreeMenuList', params)
}
