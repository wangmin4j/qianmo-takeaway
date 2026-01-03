import http from '../utils/http'

/**
 * 登录操作
 */
export const reqLogin = (code) => {
   return http.post("user/user/login", {code})
}