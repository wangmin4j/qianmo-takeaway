// 导入api
import {reqCategoryData} from '../../api/category'
import {reqDishData} from '../../api/dish'
import {reqSetmealList} from '../../api/setmeal'
Page({
  // 初始化数据
  data: {
    categoryList:[],
    id:16, // 二级菜单根据这个分类id查询
    dishList: [], //二级菜单的菜品
    type:1
  },

  // 获取商品分类的数据
  async getCategoryData() {
    const res = await reqCategoryData()
    console.log(res)
    if(res) {
      this.setData({
        categoryList: res,
        activeIndex: 0, //被激活的索引，默认0
        id: res[0].id //菜品分类的的id
      })
    }
  },
  // 更新高亮点击
  updateActive(event) {
    console.log(event.currentTarget.dataset)
    const {index,id,type} = event.currentTarget.dataset
    // console.log(index)
    this.setData({
      activeIndex: index,
      id: id,
      type
    })
    this.getDishData()
  },

  // 获取二级菜单菜品
  async getDishData() {
    const id = this.data.id; // 套餐或者分类的id
    const type = this.data.type // 1是菜品分类，2是套餐分类
    if(type === 1) {
      const dishList =  await reqDishData(id) 
      console.log(id)
      // console.log(dishList)
      this.setData({
        dishList: dishList
      })
    } else {
      const dishList =  await reqSetmealList(id) 
      console.log(id)
      // console.log(dishList)
      this.setData({
        dishList: dishList
      })
    }

  },

  // 监听页面加载
  onLoad() {
    this.getCategoryData()
    this.getDishData()
  }

})
