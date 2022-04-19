import { post } from './index'
// 新增区域
export function insertOrg(params) {
  return post('/system/org/insertOrg', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 删除区域
export function delOrgById(params) {
  return post('system/org/delOrgOrShopById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// 修改区域
export function updateShopOrOrgById(params) {
  return post('system/org/updateShopOrOrgById', params, {
    mod: 'home',
    cmd: 10008,
  })
}
