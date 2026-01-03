export const swipeCellBehavior = Behavior({
  data:{
    swipeCellQueue:[] // 滑动单元格示例
  },
  methods: {
    /**
   * 用户打开滑块时触发
   */
  swipeCellOpen(event) {
    // console.log(event)
    // 获取单元格示例
    const instance = this.selectComponent(`#${event.target.id}`)
    // 存储
    this.data.swipeCellQueue.push(instance)
  },
  /**
   * 给页面绑定点击事件
   */
  onSwipeCellPage() {
  this.onSwipeCellComClick()
  },
  /**
   * 点击滑块单元格触发的事件
   */
  onSwipeCellClick() {
    this.onSwipeCellComClick()
  },
  /**
   * 关掉滑块的方法
   */
  onSwipeCellComClick() {
    this.data.swipeCellQueue.forEach(instance => {
      instance.close()
    })
    this.data.swipeCellQueue = []
  },
  }
})