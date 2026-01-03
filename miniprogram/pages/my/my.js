// pages/info/info.js
import {getStorage} from '../../utils/storage'

Page({
  // 页面的初始数据
  data: {
    // 初始化第二个面板数据
    initpanel: [
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '商品订单',
        iconfont: 'icon-dingdan'
      },
      {
        url: '/modules/settingModule/pages/address/list/index',
        title: '收货地址',
        iconfont: 'icon-lipinka'
      },
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '退款/售后',
        iconfont: 'icon-tuikuan'
      }
    ],
    isLogin: false
  },

  // 跳转到登录页面
  toLoginPage() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 判断是否登录
  isLogin() {
    const token = getStorage('token')
    if (token) {
      this.setData({
        isLogin: true
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
  },
  onShow() {
    this.isLogin()
  }
})
