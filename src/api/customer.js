import { post } from './index'
// 查询客户
export function getCustomer(params) {
  return post('/system/user/getUsers', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 新增客户
export function addCustomer(params) {
  return post('/system/user/insertUser', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 编辑客户
export function changeCustomer(params) {
  return post('/system/user/updateUserById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
