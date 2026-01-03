// 导入网络请求模块
import http from '../utils/http'

/**
 * 根据分类号获取套餐列表
 */
export const reqSetmealList = (categoryId) => {
  return http.get(`user/setmeal/list?categoryId=${categoryId}`)
}
/**
 * 根据套餐id获取菜品
 */
export const reqDishBySetmealId = (id) => {
  return http.get(`user/setmeal/dish/${id}`)
}