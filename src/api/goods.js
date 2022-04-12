import { post } from './index'
import API_SERVICE from './API_SERVICE'

// 商品类别
export function getGoodsSizeInfo(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100009,
  })
}
// 所属季节
export function getSeasonId(params) {
  return post('/goods/series/seriesAllMethod', params, {
    mod: 'home',
    cmd: 30001,
  })
}
// 上传商品图片
// export function uploadFile(params) {
//   return post('/system/file/uploadFile', params)
// }

export function addAdvertsRes(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/addAdvertsRes`, params)
}
