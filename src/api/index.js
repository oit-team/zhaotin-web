// import Axios from 'axios'
import { Message } from 'element-ui'
// const AxiosInstance = Axios.create({
//   baseURL: '',
//   timeout: 5000,
// })

// export function request(config) {
//   return AxiosInstance.request(config).then(res => {
//     return res
//   })
// }

// export default AxiosInstance
// import Axios from 'axios'

// const AxiosInstance = Axios.create({
//   baseURL: '',
//   timeout: 5000,
// })

// export function request(config) {
//   return AxiosInstance.request(config).then(res => {
//     return res
//   })
// }

// export default AxiosInstance
import Axios from 'axios'

import API_STATUS from '@/api/API_STATUS'
// import store from '@/store'
// import userstore from '@/store/modules/user'

// axios配置
const axiosConfig = {
  // 请求超时时间
  timeout: 180000,
  baseURL: process.env.VUE_APP_BASE_URL,
}

// 创建axios实例
const axios = Axios.create(axiosConfig)

/**
 * 请求拦截器
 */
axios.interceptors.request.use((config) => {
  // console.dir(config)
  // config.headers.userId = sessionStorage.getItem('userId')
  // 每次发送请求时统一携带token
  // console.log(localStorage.getItem('token'))
  config.headers.token = localStorage.getItem('token')
  return config
}, (error) => {
  return Promise.reject(error)
})
/**
 * 响应拦截器
 */
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 403) {
    Message({
      message: '由于您长时间未操作，需要重新登录',
      type: 'warning',
    })
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = `${location.origin}/#/login`
  }
  return Promise.reject(error)
})

const defaultConfig = {
  tips: true,
}

/**
 * post封装
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {object} config 配置
 * @param {number} config.cmd 旧的接口定义
 * @param {string} config.mod 旧的接口定义
 */
export function post(url, params = {}, config = {}) {
  const {
    tips,
    cmd,
    mod,
    ...__config
  } = { ...defaultConfig, ...config }

  const userInfoStorage = JSON.parse(sessionStorage.getItem('userinfo')) || {}
  const userData = {
    userId: userInfoStorage.id,
    brandId: userInfoStorage.brandId,
    lid: userInfoStorage.logId,
  }
  // console.log(userData.userId)
  const formattedParams = {
    head: {
      aid: userData.userId,
      ver: '1.0',
      ln: 'cn',
      cmd,
      mod: mod || 'home',
      de: '2019-10-16',
      sync: 1,
      uuid: userData.brandId,
      chcode: 'ef19843298ae8f2134f',
      lid: userData.lid,
    },
    con: params,
  }

  return axios.post(url, formattedParams, __config).then((res) => {
    if (res.headers['content-type'] !== 'application/json')
      return res
    if (res.data && res.data.head && res.data.head.status === API_STATUS.OK)
      return res.data

    tips && Message.error(res.data.head.msg)
    return Promise.reject(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export default axios
