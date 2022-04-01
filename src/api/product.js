import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 获取商品数据
export function getProductList(params, head) {
  return post('/goods/style/getStyleList', params, head)
}
// 获取菜单数据
export function getTreeMenuList(params) {
  return post('/system/menu/getTreeMenuList', params, {
    cmd: 10008,
    lid: JSON.parse(sessionStorage.getItem('userinfo')).uuid,
  })
}
