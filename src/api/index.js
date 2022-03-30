import Axios from 'axios'

const AxiosInstance = Axios.create({
  baseURL: '192.168.9.53:9912/system/menu/getTreeMenuList' || '192.168.9.53:9902/system/menu/getTreeMenuList',
  timeout: 5000,
})

export function request(config) {
  return AxiosInstance.request(config).then(res => {
    return res
  })
}

export default AxiosInstance
