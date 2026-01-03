// pages/order/list/index.js
import {reqOrderList} from '@/api/order'
Page({
  // 页面的初始数据
  data: {
    orderList: [],
    page: 1,
    pageSize: 20,
      //订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消 7退款
    statusArr: ['未知','待付款','待接单','已接单', '派送中', '已完成', '已取消','退款'] 
  
  },
  /**
   * 获取历史订单
   */
  async getOrderList() {
    const {page, pageSize} = this.data
    const data = {
      page,
      pageSize
    }
    const res = await reqOrderList(data)
    this.setData({
      orderList: res.records
    })
  },

  onShow(){
    this.getOrderList()
  }
})
