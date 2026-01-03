import './utils/extendApi'
import {setStorage,getStorage,removeStorage,clearStorageSync} from './utils/storage'
import {reqLogin} from './api/user'
import { modal } from './utils/extendApi'

App({
  // 全局数据
  globalData: {
    address: {}
  },
  // 授权登录
  login() {
    return new Promise((resolve) => { // 新增Promise，标记登录完成
      wx.login({
        success: async ({code}) => {
          if(code) {
            const res = await reqLogin(code)
            setStorage('token',res.token)
            resolve(true); // 登录成功resolve
          } else {
            toast({ title: '授权失败，请重新授权' })
            resolve(false); // 登录失败也resolve，避免卡死
          }
        },
        fail: () => resolve(false) // 捕获wx.login失败
      })
    })
  },

  async openToLogin() {
    return new Promise(async (resolve) => { // 新增Promise，标记弹窗处理完成
      const res = await modal({
        title: '登录确认',
        content: '登录后才能访问数据',
        showCancel: false, 
        confirmText: '授权登录',
      })
      if (res) {
        // 等待登录完成后再resolve
        const loginResult = await this.login();
        resolve(loginResult); // 登录完成标记
      } else {
        wx.exitMiniProgram();
        resolve(false);
      }
    })
  },

  appReady: null, // 全局Promise，标记app初始化+登录完成
  onLaunch() {
    // 初始化appReady，包裹登录弹窗流程
    this.appReady = this.openToLogin();
  }
})