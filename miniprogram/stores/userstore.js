// observavle 创建被监听的对象，对象里的数据为响应式数据
// action用来定义显式的action fun
import {observable, action} from 'mobx-miniprogram'
import {getStorage} from '../utils/storage'

export const userStore = observable({
  // 响应式token
  token: getStorage('token') || '',

  // 定义action
  setToken: action(function(token) {
    this.token = token
  })
})