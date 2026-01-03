import http from '@/utils/http'
/**
 * 下单
 */
export const reqSubmitOrder = (data) => {
  return http.post('user/order/submit', data)
}
/**
 * 订单支付
 */
export const reqPayment = (data) => {
  return http.put('user/order/payment', data)
}
/**
 * 假支付
 */
export const reqFakePayment = (data) => {
  return http.post('user/order/payment/fake', data)
}

/**
 * 历史订单查询
 */
export const reqOrderList = (data) => {
  const {page, pageSize} = data
  return http.get(`user/order/historyOrders?page=${page}&pageSize=${pageSize}`)
}

/**
 * 查看订单详情
 */
export const reqOrderData = (id) => {
  return http.get(`user/order/orderDetail/${id}`)
}
/**
 * 取消订单
 */
export const reqCancelOrder = (id) => {
  return http.put(`user/order/cancel/{id}`)
}

/**
 * 再来一单
 */
export const reqOrderRepetition = (id) => {
  return http.post(`user/order/repetition/${id}`)
}
/**
 * 客户催单
 */
export const reqOrderReminder = (id) => {
  return http.get(`user/order/reminder/${id}`)
}