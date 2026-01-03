// 配置小程序项目环境变量
// 获取小程序账号信息
const {miniProgram} = wx.getAccountInfoSync()
// 获取小程序版本
const {envVersion} = miniProgram

let env = {
  baseURL: 'https://www.minwang4me.online/'
}

switch (envVersion) {
  // 开发板
  case 'develop':
    env.baseURL = 'https://www.minwang4me.online/'
    break;
  // 体验版本
  case 'trial':
    env.baseURL = 'https://www.minwang4me.online/'
    break;
  // 正式版本
  case 'release':
    env.baseURL = 'https://www.minwang4me.online/'
    break;

  default:
    env.baseURL = 'https://www.minwang4me.online/'
    break
}

export {env}