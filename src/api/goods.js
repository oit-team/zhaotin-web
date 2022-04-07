import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 商品类别请求
export function getGoodsSizeInfo(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100009,
  })
}

// 商品波段请求
export function getGoofdstyle(params) {
  return post('/system/goods/style/styleAllMethod', params, {
    mod: 'home',
    cmd: 100009,
  })
}
