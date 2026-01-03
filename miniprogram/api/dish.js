// 导入网络请求模块
import http from '../utils/http'
//根据分类id获取菜品
export const reqDishData = (categoryId) => {
  // 查询二级菜单
  console.log('获取二级菜单菜品')
  return http.get(`user/dish/list?categoryId=${categoryId}`)
}
/**
 * 根据id查询菜品
 */
export const reqDishById = (id) => {
  return http.get(`user/dish/${id}`)
}