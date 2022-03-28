import Axios from 'axios'

const AxiosInstance = Axios.create({})

export function request(config) {
  return AxiosInstance.request(config).then(res => {
    return res
  })
}

export default AxiosInstance
