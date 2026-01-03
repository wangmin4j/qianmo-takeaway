import {reqIndexData} from '../../api/index'

import {getStorage} from '../../utils/storage'

import {toast} from '../../utils/extendApi'

Page({

  data:{
    bannerList:[],//轮播图数据
    activeListList:[], // 推荐
    cateList: [], //套餐
    hotList:[],
    loading: true //是否显示骨架屏 默认显示
  },
  async getIndexData() {
        // 先获取token，确保登录成功后再请求数据（可选：防止接口无token报错）
        const token = await getStorage('token');
        if (!token) {
          this.setData({ loading: false });
          return toast({ title: '请先完成登录' });
        }
    // 调用api接口函数获取数据
    const res = await reqIndexData() 
    // console.log(res[0]) 
    this.setData({
      bannerList: res[0],
      activeListList: res[1],
      cateList: res[2],
      hotList: res[3],
      loading: false
    })
  },
  // 获取首页数据
  //监听页面加载
// 监听页面加载
async onLoad(){
  // 等待app.js的登录弹窗+登录流程完成
  const app = getApp();
  await app.appReady; // 关键：等待登录流程完成

  // 登录完成后，再加载首页数据
  this.getIndexData();
},
onShow() {
    // 登录完成后，再加载首页数据
    this.getIndexData();
}

})
