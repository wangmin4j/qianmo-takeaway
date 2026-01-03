// pages/address/list/index.js
// 获取存储的收获地址
import {reqAddressData, reqDeleteAddress} from '../../../../../api/address'
import instance from '../../../../../utils/http'
import {swipeCellBehavior} from '../../../../../behaviors/swipecell'
const app = getApp()
Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: [],
    labelArray: ['默认', '公司', '家', '学校'],

  },
  
 /**
  * 删除地址
  */
 async delAddress(event) {
  const {id} = event.currentTarget.dataset
  const {confirm} = await wx.showModal({
    content: '确认删除该收货地址吗？'
  })
  console.log(confirm)
  if (confirm) {
    await reqDeleteAddress(id)
    wx.toast({
      title: '删除成功！'
    })
    this.getAddressData()
  }
 },

  // 获取地址列表
  async getAddressData(){
    const res = await reqAddressData()
    // console.log(res)
    this.setData({
      addressList: res
    })
  },

  // 去编辑页面
  toEdit(event) {
    // 获取收货地址id
    const {id} = event.currentTarget.dataset
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },

  /**
   * 更新全局收货地址
   */
  changeAddress(event) {
    // 根据flag 判断是从哪进来的
    // 不是下订单进来的
    if(this.flag !== '1') return
    // console.log(event)
    // 下订单进来的
    const addressId = event.currentTarget.dataset.id
    // console.log(addressId)
    // 查询id的详情
    const selectAddress =  this.data.addressList.find(item => item.id === addressId)
    if(selectAddress){
      app.globalData.address = selectAddress
      wx.navigateBack()
    }
  },
  onLoad(options){
    this.getAddressData();
    // 接收 挂载
    this.flag = options.flag
  },
  onShow() {
    this.getAddressData();
  }
})
