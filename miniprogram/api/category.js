// 导入网络请求模块
import http from '../utils/http'

// 获取分类
export const reqCategoryData =  () => {
  console.log('调用分类接口')
  return  http.get('user/category/list')
}