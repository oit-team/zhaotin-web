import MD5 from 'crypto-js/md5'
import API_SERVICE from '@/api/API_SERVICE'

// 图片尺寸限制
const UPLOAD_IMAGE_SIZE_MAX = 2000
// 压缩率
const COMPRESSION_RATE = 0.7

/**
 * 获取分块上传表单数据
 * @param data
 * @param option
 * @param {file} option.file
 * @param {blob} option.fileChunk
 * @param {number} option.chunkSize
 * @param {number} option.chunkStart
 * @param {number} option.chunkEnd
 * @return {FormData}
 */
function getUploadChunkFormData(data = {}, option) {
  const formData = new FormData()
  const {
    fileChunk,
    chunkStart,
    chunkEnd,
    file,
  } = option
  const [fileName, fileSuffix] = file.name.split('.')
  /**
   * 作用：
   * 因为文件服务器是采用文件名区分，重复文件名会替换文件
   * 用小时做标识，一小时内的同名文件会被替换
   */
  const hour = Math.floor(Date.now() / (1000 * 60 * 60))
  const md5FileName = `${MD5(fileName + hour).toString()}.${fileSuffix}`

  const dataMerged = Object.assign({}, data, {
    userId: sessionStorage.userId,
    noThumb: '0',
    totalSize: file.size,
    startPos: chunkStart,
    endPos: chunkEnd,
    fname: md5FileName,
  })

  Object.entries(dataMerged).forEach(([key, value]) => {
    formData.append(key, value)
  })

  formData.set('file', fileChunk, file.name)

  return formData
}

/**
 * 获取上传文件表单
 * @param data
 * @param option
 * @param {file} option.file 文件
 * @return {FormData}
 */
function getUploadFileFormData(data, option) {
  const formData = new FormData()

  const { file } = option

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }
  formData.set('file', file, file.name)

  return formData
}

/**
 * 图片上传参数
 * @param data
 * @param option
 * @return {Promise<object>}
 */
async function getUploadImageFormData(data, option) {
  return {
    fileType: 0,
    userId: sessionStorage.userId,
    ...data,
    files: await imageCompression(option.file),
  }
}

/**
 * 获取默认表单数据
 * @param data 传入组件的数据
 * @param option 额外参数
 * @return {FormData | object}
 */
export function getDefaultFormData(data, option) {
  // !!!副作用!!! 修改上传地址
  option.action = option.action || getDefaultUploadUrlByFileType(option.file.type)

  // if (/^image\//.test(option.file.type)) {
  //   return getUploadImageFormData(data, option)
  // } else {
  if (option.fileChunk) {
    return getUploadChunkFormData(data, option)
  } else {
    return getUploadFileFormData(data, option)
  }
  // }
}

/**
 * 获取请求头
 * @return {{userId: string, token: string}}
 */
export const getDefaultHeaders = () => ({
  token: localStorage.token,
  userId: sessionStorage.userId,
})

/**
 * 默认文件项目键配置
 * @return {{uid: string, name: string, url: string}}
 */
export const getFileItemDefault = () => ({
  uid: 'resId',
  name: 'fileName',
  url: 'url',
})

/**
 * 压缩图片文件
 * @param file 图片文件
 * @return {Promise<string>} 压缩后的base64格式图片
 */
async function imageCompression(file) {
  const fileBase64 = await fileToBase64(file)
  const image = await base64ToImage(fileBase64)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const imageWidth = image.naturalWidth
  const imageHeight = image.naturalHeight
  const ratio = Math.max(imageWidth, imageHeight) / UPLOAD_IMAGE_SIZE_MAX
  // 超出尺寸则按比例缩小图片
  if (ratio > 1) {
    canvas.width = imageWidth / ratio
    canvas.height = imageHeight / ratio
  } else {
    canvas.width = imageWidth
    canvas.height = imageHeight
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', COMPRESSION_RATE)
}

/**
 * 文件转base64
 * @param file
 * @return {Promise<string>}
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * base64转图片
 * @param base64
 * @return {Promise<HTMLImageElement>}
 */
function base64ToImage(base64) {
  const image = new Image()
  image.src = base64
  return new Promise((resolve, reject) => {
    image.onload = (e) => resolve(e.target)
  })
}

/**
 * 根据文件类型返回上传地址
 * @param type
 * @return {string}
 */
export function getDefaultUploadUrlByFileType(type) {
  // if (/^image\//.test(type)) {
  //   // 图片上传地址
  return API_SERVICE.SYSTEM + '/file/uploadFile'
  // } else {
    // 默认地址
  // return API_SERVICE.SYSTEM + '/file/upVideoOrAudio'
  // }
}

// 提供一些实用内容，与公共内容区分开
export const mixin = {
  props: {
    fileKeyMap: {
      type: Object,
      default: getFileItemDefault,
    },
  },
  computed: {
    fileListFormatted() {
      return this.fileList.map(fileItem => {
        return Object
          .entries(this.fileKeyMap)
          .reduce((item, [key, mapKey]) => {
            item[key] = fileItem[mapKey]
            return item
          }, {
            _data: fileItem,
          })
      })
    },
  },
  methods: {
    /**
     * 验证文件是否有效
     * @param file
     * @return {boolean}
     */
    checkFile(file) {
      if (this.checkFileType(file) === false) {
        this.$message.error(`${file.name} 文件类型不正确`)
        return false
      }
      if (this.checkFileSize(file) === false) {
        this.$message.error(`${file.name} 文件过大!`)
        return false
      }
      return true
    },
    /**
     * 校验文件类型
     * @param {file} file 文件
     * @param accept
     * @return {boolean} 校验结果
     */
    checkFileType(file, accept) {
      accept = accept || this.$attrs.accept
      if (accept) {
        return accept.split(',').some(item => {
          item = item.trim()

          if (/^\./.test(item)) {
            return new RegExp(item).test(file.name)
          } else {
            return new RegExp(item.replace('*', '')).test(file.type)
          }
        })
      }
    },
    /**
     * 校验文件大小
     * @param {file} file 文件
     * @return {boolean} 校验结果
     */
    checkFileSize(file) {
      const maxSize = this.getOptionByFileType('maxSize', file)
      if (maxSize !== undefined) return file.size <= (maxSize * 1024)
    },
    /**
     * 检测上传是否全部成功
     * @return {boolean}
     */
    checkUploadDone() {
      return this.uploadFiles.every(item => item.status === 'success')
    },
    /**
     * 获取上传文件
     */
    getUploadResults() {
      return this.uploadFiles.map(item => {
        return {
          ...item._data,
          [this.fileKeyMap.name]: item.name,
          [this.fileKeyMap.url]: item.response ? item.response.data.fileUrl : item.url,
        }
      })
    },
    /**
     * 获取图片上传结果
     */
    getUploadImageResults() {
      return this.uploadFiles.map(item => (
        item.response
          ? item.response.data.data.fileUrls[0].fileUrl
          : item.url
      ))
    },
  },
}
