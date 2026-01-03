
const toast = ({title='数据加载中...', icon = 'none', duration = 2000, mask = true} = {}) => {
    wx.showToast({
      title,
      icon,
      duration,
    })
}

const modal = (option = {}) => {
  return new Promise((resolve) => {
    // 默认参数
    const defaultOpt = {
      title: '提示',
      content: '确认执行该操作吗？',
      confirmColor: '#3514f'
    }

  const opts = Object.assign({}, defaultOpt, option)


    wx.showModal({
     ...opts,
      complete: ({confirm, cancel}) => {
        confirm &&  resolve(true)
        cancel && resolve(false)
      }
    })
  })
}

wx.toast = toast
wx.modal = modal

export {toast, modal}