import { post } from './index'
// 查询客户/用户
export function getCustomer(params) {
  return post('/system/user/getUsers', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 新增客户/用户
export function addCustomer(params) {
  return post('/system/user/insertUser', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 编辑客户/用户
export function changeCustomer(params) {
  return post('/system/user/updateUserById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 删除客户/用户
export function delUserById(params) {
  return post('/system/user/delUserById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 导出客户导出字段
export function getExportinfo(params) {
  return post('/system/excelPublic/getExportInfo', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 导出客户
export function getExportCustomer(params, config) {
  return post('system/user/getExportCustomer', params, {
    ...config,
    mod: 'home',
    cmd: 10008,
  })
}
