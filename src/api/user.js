import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 登录请求
export function reqLogin(params) {
  return post('/system/user/login', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 角色管理
export function reqRole(params) {
  return post('/system/role/getRoleList', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 新增角色
export function addRole(params) {
  return post('/system/role/insertRole', params, {
    mod: 'home',
    cmd: 10008,
  })
}
