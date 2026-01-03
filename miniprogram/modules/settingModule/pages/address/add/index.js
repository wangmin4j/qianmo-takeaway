// api方法
import {reqAddAddressData, reqAddressInfo, reqUpdateAddress, reqSetDefaultAddress} from '../../../../../api/address'

Page({
  // 页面的初始数据
  data: {
      //性别选择器
      sexArray: ['先生', '女士'],
      labelArray: ['默认', '公司', '家', '学校'],
      id: null,
      //用户id
      userId: null,
      // 收货人
      consignee: '',
      // 手机号
      phone: '',
      // 性别  0 男 1 女
      sex: null,
      // 省级区划编号
      provinceCode: '',
      // 省级名称
      provinceName: '',
      //市级区划编号
      cityCode: '',
      //市级名称
      cityName: '',
       //区级区划编号
      districtCode: '',
      //区级名称
      districtName: '',
      //详细地址
      detail: '',
      //标签
      label: 0,
      //是否默认地址 0否 1是
      isDefault: false
  },

  // 保存收货地址
 async saveAddrssForm() {
    /**
     * 解析参数
     */
    const {     
      id,   
      // 收货人
      consignee,
      // 手机号
      phone,
      // 性别  0 男 1 女
      sex,
      // 省级区划编号
      provinceCode,
      // 省级名称
      provinceName,
      //市级区划编号
      cityCode,
      //市级名称
      cityName,
       //区级区划编号
      districtCode,
      //区级名称
      districtName,
      //详细地址
      detail,
      //标签
      label,
      // 是否默认地址
      isDefault
      } = this.data

      /**
       * 保存发送的请求参数
       */
      const params = {
        // 收货人
      consignee,
      // 手机号
      phone,
      // 性别  0 男 1 女
      sex,
      // 省级区划编号
      provinceCode,
      // 省级名称
      provinceName,
      //市级区划编号
      cityCode,
      //市级名称
      cityName,
       //区级区划编号
      districtCode,
      //区级名称
      districtName,
      //详细地址
      detail,
      //标签
      label,
      }
      /**
       * 编辑发送的参数
       */
      const paramsEdit = {
        id,
          // 收货人
        consignee,
        // 手机号
        phone,
        // 性别  0 男 1 女
        sex,
        // 省级区划编号
        provinceCode,
        // 省级名称
        provinceName,
        //市级区划编号
        cityCode,
        //市级名称
        cityName,
         //区级区划编号
        districtCode,
        //区级名称
        districtName,
        //详细地址
        detail,
        //标签
        label,
        // 是否默认地址
        isDefault: isDefault ? 1 : 0
        }


      // console.log(params)
      // 参数验证

      // 新增请求
      if(!id) {
        const res = await reqAddAddressData(params)
        // console.log(res)
        // 返回上一页
        wx.navigateBack()
        wx.toast({
          title: '新增收货地址成功'
        })
      } else {
        await reqUpdateAddress(params)

        // 如果修改了是否默认地址选项
        if(isDefault) {
          await reqSetDefaultAddress(paramsEdit)
        }

        // 返回上一页
        wx.navigateBack()
        wx.toast({
          title: '更新收货地址成功'
        })
      }

  },

  // 省市区选择
  onAddressChange(event) {
    // console.log(event)
    // 结构省市区和编码
    const [provinceName, cityName, districtName] = event.detail.value
    const [provinceCode, cityCode, districtCode] = event.detail.code
    this.setData({
      provinceName, cityName, districtName, provinceCode, cityCode, districtCode
    })
  },

  /**
   * 性别选择
   */
  onSexChange(event) {
    // console.log(event)
    const sex = event.detail.value
    this.setData({
      sex
    })
  },
  /**
   * 标签选择器
   */
  onLabelChange(event) {
    const label = event.detail.value
    this.setData({
      label
    })
  },
  /**
   * 处理跟新相关
   */
  async showAddressInfo(id) {
    // 判断是否存在id
    if(!id) {
      return
    }
    this.setData({
      id
    })
    // 动态设置标题
    wx.setNavigationBarTitle({
      title: '更新收货地址'
    })
    // 调用api反显
    const res = await reqAddressInfo(id)
    // console.log(res)
    this.setData(res)
  },

  /**
   * 钩子函数
   */
  onLoad(option) {
    /**
     * 实现更新逻辑
     */
    // console.log(option.id)
    this.showAddressInfo(option.id)
  }
})
