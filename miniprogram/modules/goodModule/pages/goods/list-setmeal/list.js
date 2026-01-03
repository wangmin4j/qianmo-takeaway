// pages/goods/list/index.js
import {reqDishBySetmealId} from '../../../../../api/setmeal'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕
    id: null,
    dishList: []
  },
  /**
   * 获取套餐菜品
   */
  async getDishBySetmealId () {
    const id = this.data.id
    const res =await reqDishBySetmealId(id)
    this.setData({
      dishList: res
    })
    console.log(res)
  },

  onLoad(options) {
    const {id} = options
    this.setData({
      id
    })
    this.getDishBySetmealId()
  }

})
