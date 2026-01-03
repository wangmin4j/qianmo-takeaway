// 存储数据 
export const setStorage = (key, value) => {
  try{
    wx.setStorageSync(key, value)
  } catch(error) {
    console.error('存储指定 ${key} 数据发生了异常', error)
  }
}

// 读取
export const getStorage = (key) => {
  try{
    const value = wx.getStorageSync(key)
    if(value) {
      return value
    }
  }catch(error) {
    console.error('读取指定 ${key} 数据发生了异常', error)
  }
}
// 移除一个
export const removeStorage = (key) => {
  try{
     wx.removeStorageSync(key)
  }catch(error) {
    console.error('移除指定 ${key} 数据发生了异常', error)
  }
}
//清空
export const clear =  () => {
  try{
    wx.clearStorageSync(key)
 }catch(error) {
   console.error('清空数据发生了异常', error)
 }
}

// 异步存储
export const asyncSetStorage = (key, data) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      data,
      complete (res) {
        resolve(res)
      }
    })
  })
}
// 异步获取
export const asyncGetStorage = (key) => {
  return new Promise((resolve) => {
    wx.getStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}
// 移除
export const asyncRemovetStorage = (key) => {
  return new Promise((resolve) => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}
// 异步清空全部数据
export const asyncCleartStorage = () => {
  return new Promise((resolve) => {
    wx.clearStorage({
      complete(res) {
        resolve(res)
      }
    })
  })
}

