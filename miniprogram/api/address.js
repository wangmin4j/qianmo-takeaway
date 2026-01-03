import http from '../utils/http'

// 获取收货地址
/**
 * 获取收货地址
 */
export const reqAddressData = () => {
  return http.get('user/addressBook/list')
}

// 新增收获地址 
/**
 * 新增收获地址 
 * @param {*} data 地址对象
 */
export const reqAddAddressData = (data) => {
  return http.post('user/addressBook', data)
}
/**
 * 收货地址详情
 */
export const reqAddressInfo = (id) => {
  return http.get(`user/addressBook/${id}`)
}
/**
 * 更新收获地址
 */
export const reqUpdateAddress = (data) => {
  return http.put('user/addressBook',data)
}
/**
 * 设置默认地址
 */
export const reqSetDefaultAddress = (data) => {
  return http.put('user/addressBook/default', data)
}
/**
 * 删除地址
 */
export const reqDeleteAddress = (id) => {
  return http.delete(`user/addressBook?id=${id}`)
}
/**
 * 查询默认地址
 */
export const reqGetDefaultAddress = () => {
  return http.get('user/addressBook/default')
}