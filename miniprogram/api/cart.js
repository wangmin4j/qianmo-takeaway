// 导入网络请求模块
import http from '../utils/http'

/**
 * 查看购物车
 */
export const reqCartList = () => {
  return http.get('/user/shoppingCart/list')
}
/**
 * 加入购物车
 */
export const reqAddCart = (data) => {
  http.post('/user/shoppingCart/add',data)
}
/**
 * 清空购物车
 */
export const reqCleanCart = () => {
  return http.delete('user/shoppingCart/clean')
}
/**
 * 删除一个菜品
 */
export const reqDelCart = (data) => {
  return http.post('user/shoppingCart/sub', data)
}
/**
 * 删除一条菜品
 */
export const reqDelItem = (id) => {
  return http.delete(`user/shoppingCart/carts/${id}`)
}