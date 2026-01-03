import {reqCartList} from '@/api/cart'
import {reqGetDefaultAddress} from '@/api/address'
import { reqSubmitOrder, reqFakePayment } from '@/api/order'
import {formatTime} from '@/utils/formatTime'
const app = getApp()

Page({
  data: {
    labelArray: ['默认', '公司', '家', '学校'],
    remark: '',
    show: false, // 期望送达日期弹框
    minDate: new Date(Date.now() + 30 * 60 * 1000).getTime(),
    maxDate: new Date(new Date().getFullYear() + 1, 11, 31, 23, 59).getTime(),
    currentDate: new Date().getTime(),
    cartList:[],
    address: {}, // 默认收货地址
    totalPrice: 0,
    packAmount: 3,  // 打包费
    payMethod: 1, // 1微信 2支付宝
    estimatedDeliveryTime: '', // 预计送达时间
    deliveryStatus: 1, //默认立即配送
    tablewareNumber: 1, //餐具默认1
    tablewareStatus: 1 // 默认按需提供
  },
  /**
   * 下单
   */
  async submitOrder() {
    const data = {
      // 地址簿id
      addressBookId: this.data.address.id,
      // 付款方式
      payMethod: this.data.payMethod,
      // 备注
      remark: this.data.remark,
      // 预计送达时间
      estimatedDeliveryTime: this.data.estimatedDeliveryTime,
      // 配送状态 1立即送出 0其他时间
      deliveryStatus: this.data.deliveryStatus,
      // 餐具数量
      tablewareNumber: this.data.tablewareNumber,
      //餐具数量状态  1按餐量提供  0选择具体数量
      tablewareStatus: this.data.tablewareStatus,
      // 打包费
      packAmount: this.data.packAmount,
      //总金额
      amount: this.data.totalPrice
    }
    const {orderNumber} = await reqSubmitOrder(data)
    // console.log(res)
    if(orderNumber) {
      const data = {
        orderNumber
      }
      // 模拟支付
      const frRs = await reqFakePayment(data)
      if(frRs) {
      const modalRes = await wx.modal({
          title: '模拟支付成功',
          content: '接下来将跳转到订单列表界面'
        })
        if(modalRes) {
          wx.reLaunch({
            url:"/modules/orderPayModule/pages/order/list/list"})
        } else {
          wx.navigateBack()
        }
      }
    }


  },
  /**
   * 反显购物车数据
   */
  async getCartList(){
    const res = await reqCartList()
    // console.log(res)
    this.setData({
      cartList: res,
    })
    this.getTotalPrice()
   },
   /**
    * 获取默认收货地址
    */
   async getDefaultAddress() {
    // 如果全局共享中存在数据,就使用这个
    const addressId = app.globalData.address.id
    if(addressId) {
      this.setData({
        address: app.globalData.address
      })
      return
    } 
    // 如果全局地址没数据
    const res = await reqGetDefaultAddress()
    this.setData({
      address: res
    })
   },
   /**
    * 计算总金额
    */
   getTotalPrice() {
    let totalPrice = 0
    this.data.cartList.forEach(item => {
      totalPrice += item.amount * item.number
    });
    this.setData({
      totalPrice: totalPrice
    })
    // console.log(totalPrice)
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    // console.log(event.detail)
    const timeRes =  formatTime(new Date(event.detail))
    // console.log(timeRes)

    this.setData({
      show: false,
      estimatedDeliveryTime: timeRes
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date(Date.now() + 30 * 60 * 1000).getTime(),
      maxDate: new Date(new Date().getFullYear() + 1, 11, 31, 23, 59).getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index'
    })
  },
  onShow(){
    this.getCartList()
    this.getDefaultAddress()
  },
  onUnload(){
    app.globalData.address = {}
  }
})
