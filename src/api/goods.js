import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 商品一级类别
export function getGoodsSizeInfo(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100009,
  })
}
// 商品二级分类树
export function getGoodsSizeClass(params) {
  return post('/goods/styleType/getStyleTypeInfoAll', params, {
    mod: 'home',
    cmd: 100001,
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
// 商品厚薄程度
export function getStyleData(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100009,
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
// 导入商品
export function addimporStyleInfo(params) {
  return post('addimporStyleInfo', params)
}
// 导出商品
export function getExportInfo(params) {
  return post('system/excelPublic/getExportInfo', params)
}

export function getExportStyleInfo(params, config) {
  return post('goods/style/getExportStyleInfo', params, {
    ...config,
    mod: 'home',
    cmd: 10008,
  })
}

// 新增商品
export function addGoodsInfo(params) {
  return post('/goods/style/addStyleInfo', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 查询商品信息
export function getStyleById(params) {
  return post('/goods/style/getStyleById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 编辑商品
export function updateStyleInfo(params) {
  return post('/goods/style/updateStyleInfo', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 商品上下架
export function updateStyleStatusById(params) {
  return post('/goods/style/updateStyleStatusById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 查询季节列表
export function getSeason(params) {
  return post('/goods/season/getSeason', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 新增季节
export function addSeason(params) {
  return post('/goods/season/addSeason', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 修改季节
export function updateSeason(params) {
  return post('/goods/season/updateSeason', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 查询季节详情
export function getSeasonById(params) {
  return post('/goods/season/getSeasonById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 删除季节
export function delSeason(params) {
  return post('/goods/season/deleteSeason', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 商品类别
export function getGoodsCategoryInfo(params) {
  return post('/goods/styleType/getStyleTypeList', params)
}
// 查询商品类别树状图
export function getGoodsCategoryTreeInfo(params) {
  return post('/goods/styleType/getStyleTypeInfoAll', params)
}
