import { post } from './index'
// import API_SERVICE from './API_SERVICE'

// 登录请求
export function reqLogin(params) {
  return post('/system/user/login', params, {
    mod: 'home',
    cmd: 10008,
  })
}
// export function LoginPage(params) {
//   return post(`${API_SERVICE.SYSTEM}/user/login`, params, {
//     cmd: 10008,
//     mod: 'home',
//   })
// }
