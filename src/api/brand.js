import { post } from './index'
// 查询客户
export function getTreeOrgList(params) {
  return post('system/org/getTreeOrgList', params, {
    mod: 'home',
    cmd: 10008,
  })
}
