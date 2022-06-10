import { post } from './index'
// 获取菜单列表
export function cateGoryList(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100001,
  })
}
// 新增类别
export function addCateGory(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100002,
  })
}
// 删除类别
export function delCateGory(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100004,
  })
}
// 修改类别
export function updateCateGory(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100003,
  })
}
// 判断排序
export function sort(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100005,
  })
}
// 查询尺码已存在的排序
export function getSizeSortList(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100006,
  })
}
// 查询排序
export function sortList(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100006,
  })
}
// 查询 所有词典
export function getDictionaryList(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 查询 dictcode 对应列表
export function getDictionaryInfo(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100009,
  })
}
// 类别尺码
export function getSizeInfoAll(params) {
  return post('/goods/size/getSizeInfoAll', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 相关类别
export function clothingSizeInfo(params) {
  return post('/goods/size/clothingSizeInfo', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 删除尺码
export function delSizeInfo(params) {
  return post('/goods/size/delSizeInfo', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 修改尺码
export function updateSizeInfo(params) {
  return post('/goods/size/updateSizeInfo', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 新增尺码
export function insertSizeInfo(params) {
  return post('/goods/size/insertSizeInfo', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 新增类别相关配置
export function updateSizeConfInfo(params) {
  return post('/goods/size/updateOrAddSizeConfInfo', params, {
    mod: 'home',
    cmd: 100008,
  })
}
// 查询积分配置code对应的配置信息
export function getCollocation(params) {
  return post('/goods/integralRole/getIntegralRuleList', params, {
    mod: 'vue',
  })
}
// 删除积分规则
export function deleteCollocation(params) {
  return post('/goods/integralRole/deleteIntegralRule', params, {
    mod: 'vue',
  })
}
// 新增积分规则
export function addCollocation(params) {
  return post('/goods/integralRole/addIntegralRule', params, {
    mod: 'vue',
  })
}
// 修改积分规则
export function updateCollocation(params) {
  return post('/goods/integralRole/updateIntegralRule', params, {
    mod: 'vue',
  })
}
