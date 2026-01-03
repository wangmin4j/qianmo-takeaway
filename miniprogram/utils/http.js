import WxRequest from 'mina-request'
// 导入封装的存储模块
import {getStorage, clearStorage} from './storage'
import { toast, modal } from './extendApi'
import {env} from './env'

const instance = new WxRequest({
  // baseURL: 'https://www.minwang4me.online/',
  baseURL: env.baseURL,
  timeout: 15000,
  isLoading: false
})

// 请求拦截器
instance.interceptors.request = (config) => {
  config.header = config.header || {};
  const authentication = getStorage('token')
  if (authentication) {
    config.header['authentication'] = authentication
  }
  return config
}

// 响应拦截器

instance.interceptors.response = async (response) => {
  const {data, isSuccess} = response

  if(!isSuccess) {
    toast({
      title: '网络异常',
      icon: 'error'
    })
    return Promise.reject(response)
  }
  // 如果成功
  switch(data.code){
    case 1:
    case 200:
      // console.log(data.data)// 可以正常输出
      return data.data

    case 208:
      const res = await modal({
        content: '登录过期，请重新登录',
        showCancel: false
      })
      if(res) {
        // 去除用户消息
        clearStorage()
        wx.navigateTO({
          url: '/pages/login'
        })
      }
      return Promise.reject(response)
    case 0:
      toast({
        title: data.msg
      })
      return Promise.reject(response)
    default:
      toast({
        title: data.msg
      })
      return Promise.reject(response)
  }

}

export default instance