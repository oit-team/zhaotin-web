import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 登录请求
export function reqLogin(params) {
  return post('/system/user/login', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 角色列表
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
// 编辑用户
export function setRole(params) {
  return post('/system//role/updateRoleById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 删除用户
export function deleteRole(params) {
  return post('/system/role/delRoleById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 获取用户列表
export function getRoleUserList(params) {
  return post('/system/role/getRoleUserList', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 用户授权
export function addUserAndRole(params) {
  return post('/system/user/addUserAndRole', params, {
    mod: 'home',
    cmd: 10008,
  })
}
