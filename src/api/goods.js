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
  return post('/goods/season/getSeason', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 商品尺码
export function getClothingSizeInfo(params) {
  return post('/goods/size/clothingSizeInfo', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 删除商品
export function getDeleteStyleInfo(params) {
  return post('/goods/style/deleteStyleInfo', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 提交文件
export function addAdvertsRes(params) {
  return post('/adverts/addAdvertsRes', params)
}
// 导出商品
export function getExportInfo(params) {
  return post('system/excelPublic/getExportInfo', params)
}
