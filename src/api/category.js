import { post } from './index'
// 获取菜单列表
export function cateGoryList(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
  })
}
