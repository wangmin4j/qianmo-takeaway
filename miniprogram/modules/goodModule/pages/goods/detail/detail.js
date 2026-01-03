// pages/goods/detail/index.js
import {reqDishById} from '@/api/dish'
import { userBehavior} from '@/behaviors/userBehavior'
import {reqAddCart, reqCartList} from '@/api/cart'

Page({
  behaviors: [userBehavior],

  // 页面的初始数据
  data: {
	goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    id:null,
    dishFlavor: null,
    dishInfo: {},
    urls:[],
    buyNow: 0, //加入购物车还是立即购买 0 加入购物车 1 立即购买
    allCount: ''//购物车里商品的数量
  },
  /**
   * 全屏预览图片
   */
  previewImage() {
    this.data.urls.push(this.data.dishInfo.image)
    wx.previewImage({
      urls: this.data.urls
  })
  },
/**
 * 获取菜品详情
 */
async getDishById (){
  const id = this.data.id
  const res = await reqDishById(id)
  this.setData({
    dishInfo: res
  })
},
/**
 * 弹窗的确认按钮
 */
async handlerSubmit() {
  const {buyNow, id, dishFlavor} = this.data
  const data = {
    dishId: id,
    dishFlavor: dishFlavor
  }

  // 加入购物车
  if (buyNow === 0) {
    const res = await reqAddCart(data)
    wx.toast({
      title: '加入购物车成功'
    })
    //更新购物车商品数量
    this.getCartCount()
    this.setData({
      show: false
    })
  } else { //加入并购买
    const res = await reqAddCart(data)
    wx.toast({
      title: '加入购物车成功'
    })
        //更新购物车商品数量
        this.getCartCount()
        this.setData({
          show: false
        })
    wx.navigateTo({
      url: '/modules/orderPayModule/pages/order/detail/detail'
    })
  }

},


  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    console.log(event.detail)
  },

  /**
   * 计算购物车商品数量
   */
  async getCartCount () {
    // 获取购物车列表数据
    const res = await reqCartList()
    const cartList = res
    let allCount = 0
    cartList.forEach(element => {
      allCount += element.number
    });
    // console.log(allCount)
    this.setData({
      allCount: (allCount > 99 ? '99+' : allCount + '')
    })
    
  },

  onLoad(options) {
    const {id} = options
    this.setData({
      id
    }),
    this.getDishById()
    this.getCartCount()
  }


})
