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
// 查询排序
export function sortList(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    mod: 'home',
    cmd: 100006,
  })
}
