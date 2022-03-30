import { post } from './index'
// import API_SERVICE from './API_SERVICE'
export function reqGetProductList(params) {
  return post('/style/getStyleList', params)
}
