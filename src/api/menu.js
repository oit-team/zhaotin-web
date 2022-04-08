import { post } from './index'
// 获取菜单列表
export function getAllMenuList(params) {
  return post('/system/menu/getAllMenuList', params, {
    cmd: 10008,
    lid: JSON.parse(sessionStorage.getItem('userinfo')).uuid,
  })
}
// 新增菜单
export function insertMenu(params) {
  return post('/system/menu/insertMenu', params, {
    cmd: 10008,
    lid: JSON.parse(sessionStorage.getItem('userinfo')).uuid,
  })
}
// 编辑菜单
export function updateMenuById(params) {
  return post('/system/menu/updateMenuById', params, {
    cmd: 10008,
    lid: JSON.parse(sessionStorage.getItem('userinfo')).uuid,
  })
}
// 删除菜单
export function delMenuById(params) {
  return post('/system/menu/delMenuById', params, {
    cmd: 10008,
    lid: JSON.parse(sessionStorage.getItem('userinfo')).uuid,
  })
}
