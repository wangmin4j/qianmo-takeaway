// pages/login/login.js
import {toast} from '../../utils/extendApi'
// 登录api
import {reqLogin} from '../../api/user'
// 本地存储api
import {setStorage} from '../../utils/storage'
// 导入可以全局响应的
import {ComponentWithStore} from 'mobx-miniprogram-bindings'
// 导入要响应的全局变量
import {userStore} from '../../stores/userstore'
ComponentWithStore({
  // 页面和对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token'],
    actions: ['setToken']
  },
  methods: {
    // 授权登录
  login() {
    // 使用wx.login获取临时登录凭证
    wx.login({
      success: async ({code}) => {
         if(code) {
          // 调用接口登录
          const res = await reqLogin(code)
          // console.log(res)
          // 登录成功存储token
          setStorage('token',res.token)

          // token存到store
          this.setToken(res.token)
          wx.navigateBack()
          // console.log(res.token)
         } else {
          toast({
            title: '授权失败，请重新授权'
          })
         }
      }
    })
  }
  }
})
