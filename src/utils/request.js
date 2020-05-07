import axios from 'axios'
import {
  Message
} from 'element-ui'
/**
 * 提示函数
 * 禁止点击蒙层
 */
const tip = msg => {
  Message({
    message: msg,
    showClose: true,
    type: 'error',
    duration: 2 * 1000,
    offset: 240
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Object}  请求失败返回的对象
 */
const errorHandle = (erroObj, other) => {
  console.log(erroObj)
  // 状态码判断 404：请求资源失败 500: 服务器异常  400:
  switch (erroObj.status) {
    case 400:
    case 404:
      tip('资源请求失败,请联系管理员！')
      break
    case 500:
      tip('服务器异常,请联系管理员！')
      break
    default:
      console.log(erroObj.msg)
  }
}

let axiosUrl = ''
// 环境的切换
if (process.env.NODE_ENV === 'development') {
  axiosUrl = ''
} else if (process.env.NODE_ENV === 'production') {
  axiosUrl = ''
}
// 创建axios实例
var service = axios.create({
  baseURL: axiosUrl,
  timeout: 10000, // 10秒
  withCredentials: true // 这里设置了withCredentials
})
/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.error(error))

// 响应拦截器
service.interceptors.response.use(
  // 请求成功
  // eslint-disable-next-line eqeqeq
  res => {
    if (res.status === 200) {
      const { data } = res
      // eslint-disable-next-line eqeqeq
      if (data.code != 0) {
        // eslint-disable-next-line eqeqeq
        if (data.code == 1002) {
          tip('身份验证失效,需重新登录！')
          // eslint-disable-next-line eqeqeq
        } else if (data.code == 2010) {
          // 没有访问权限
          console.log('没有访问权限')
          // eslint-disable-next-line eqeqeq
        } else if (data.code === '2021') {
          console.log('未扫描二维码')
        } else if (data.code === '2022') {
          console.log('正在等待确认')
        } else {
          tip(data.msg)
        }
      }
      return Promise.resolve(res)
    } else {
      return res
    }
  },
  // 请求失败
  error => {
    // 必须对error错误进行解构
    const { response } = error
    console.log('error', response)
    if (response) {
      console.log(response)
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.data)
      return Promise.reject(response)
    } else {
      console.log(error)
      errorHandle(error)
      return Promise.reject(error)
    }
  })

export default service
