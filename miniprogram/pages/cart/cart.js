// pages/cart/component/cart.js
import { swipeCellBehavior } from '../../behaviors/swipecell';
import { reqCartList, reqCleanCart, reqAddCart, reqDelCart, reqDelItem } from '../../api/cart';
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { userStore } from '@/stores/userstore';

// 计算总价
const computedBehavior = require('miniprogram-computed').behavior;

ComponentWithStore({
  // 关联store
  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  behaviors: [swipeCellBehavior, computedBehavior],
  computed: {
    // 优化：精准计算总价，兼容空值，统一单位转换
    totalPrice(data) {
      if (!Array.isArray(data.cartList)) return 0;
      return data.cartList.reduce((sum, item) => {
        const amount = Number(item?.amount) || 0; // 金额转数字，兜底0
        const number = Number(item?.number) || 0; // 数量转数字，兜底0
        return sum + (amount * number * 100); // 统一转分（根据业务调整）
      }, 0);
    }
  },

  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～',
    cartLoading: false, // 购物车操作加载锁，防止重复请求
  },

  methods: {
    /**
     * 去结算
     */
    toOrder() {
      // 优化：结算前校验购物车是否为空
      if (this.data.cartList.length === 0) {
        wx.showToast({ title: '购物车为空，无法结算', icon: 'none' });
        return;
      }
      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      });
    },

    /**
     * 跳转到分类页
     */
    goToCategory() {
      wx.navigateTo({
        url: '/pages/category/category'
      });
    },
    noop(){

    },

    /**
     * 核心优化：更新购物车商品数量（解决显示不及时）
     */
    async changBuyNum(event) {
      // 1. 加载中禁止重复操作
      if (this.data.cartLoading) return;

      // 2. 解构并校验数据
      const { detail: num } = event;
      const { id, index, oldbuynum, dishflavor } = event.target.dataset;
      if (!id || index === undefined || oldbuynum === undefined) return;

      // 3. 边界处理：限制数量 0~200
      const newBuyNum = Math.min(Math.max(Number(num) || 0, 0), 200);
      const changeNum = newBuyNum - Number(oldbuynum); // 变化量（+1/-1）

      // 4. 只处理加减1操作，过滤无效操作
      if (![1, -1].includes(changeNum)) return;

      const reqData = { dishId: id, dishflavor };
      this.setData({ cartLoading: true });

      try {
        // 🌟 乐观更新：先更页面状态，再请求接口（解决显示不及时）
        this.updateCartLocal(index, changeNum);

        // 5. 执行接口请求
        if (changeNum === 1) {
          await reqAddCart(reqData);
        } else {
          await reqDelCart(reqData);
        }

        // 6. 可选：兜底同步最新数据（低频操作，避免频繁请求）
        // 仅在网络不稳定场景开启，日常依赖乐观更新即可
        // await this.getCartList(true);

      } catch (error) {
        // 7. 接口失败：回滚本地状态，提示用户
        this.updateCartLocal(index, -changeNum);
        wx.showToast({ title: '操作失败，请重试', icon: 'none', duration: 2000 });
        console.error('购物车数量更新失败：', error);
      } finally {
        // 8. 无论成败，关闭加载锁
        this.setData({ cartLoading: false });
      }
    },

    /**
     * 本地更新购物车数量（核心：无需等待接口）
     * @param {number} index 商品在列表中的索引
     * @param {number} changeNum 变化量（+1/-1）
     */
    updateCartLocal(index, changeNum) {
      const cartList = [...this.data.cartList]; // 浅拷贝避免直接修改原数组
      if (!cartList[index]) return;

      // 更新数量，确保不小于0
      cartList[index].number = Math.max(0, Number(cartList[index].number) + changeNum);

      // 可选：数量为0时移除该商品（根据业务需求）
      // if (cartList[index].number === 0) {
      //   cartList.splice(index, 1);
      // }

      this.setData({ cartList }); // 本地更新，页面立即响应
    },

    /**
     * 获取购物车列表（优化：防抖+缓存+加载状态）
     * @param {boolean} forceRefresh 是否强制刷新（默认false，避免重复请求）
     */
    async getCartList(forceRefresh = false) {
      // 防止短时间重复请求
      if (this.data.cartLoading && !forceRefresh) return;

      this.setData({ cartLoading: true });
      try {
        const res = await reqCartList();
        // 校验接口返回数据格式
        const cartList = Array.isArray(res) ? res : [];
        this.setData({
          cartList,
          emptyDes: cartList.length === 0 ? '还没有添加商品，快去添加吧～' : ''
        });
      } catch (error) {
        wx.showToast({ title: '获取购物车失败', icon: 'none' });
        console.error('获取购物车列表失败：', error);
      } finally {
        this.setData({ cartLoading: false });
      }
    },

    /**
     * 清空购物车（优化：交互+异常处理）
     */
    async cleanCart() {
      try {
        // 优化：使用官方 wx.showModal（原 wx.modal 可能是封装错误）
        const { confirm } = await wx.showModal({
          title: '确认清空',
          content: '清空后将删除所有商品，是否确认？',
          cancelColor: '#666',
          confirmColor: '#f4333c'
        });

        if (confirm) {
          await reqCleanCart();
          // 清空后主动刷新列表
          await this.getCartList(true);
          wx.showToast({ title: '购物车已清空', icon: 'success' });
        }
      } catch (error) {
        wx.showToast({ title: '清空失败，请重试', icon: 'none' });
        console.error('清空购物车失败：', error);
      }
    },

    /**
     * 删除单个菜品（优化：交互+异常处理）
     */
    async delCartDish(event) {
      const { id } = event.currentTarget.dataset;
      if (!id) return;

      try {
        const { confirm } = await wx.showModal({
          title: '确认删除',
          content: '是否删除该商品？',
          cancelColor: '#666',
          confirmColor: '#f4333c'
        });

        if (confirm) {
          this.setData({ cartLoading: true });
          await reqDelItem(id);
          // 删除后刷新列表（或本地删除，优化显示）
          // 本地删除方案（更高效）：
          // const cartList = this.data.cartList.filter(item => item.id !== id);
          // this.setData({ cartList });
          await this.getCartList(true);
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      } catch (error) {
        wx.showToast({ title: '删除失败，请重试', icon: 'none' });
        console.error('删除购物车商品失败：', error);
      } finally {
        this.setData({ cartLoading: false });
      }
    },

    /**
     * 页面显示时刷新购物车（避免缓存）
     */
    onShow() {
      this.getCartList(true); // 强制刷新
    },

    /**
     * 页面隐藏时关闭滑动单元格
     */
    onHide() {
      this.onSwipeCellComClick?.(); // 可选链避免方法不存在报错
    }
  },

  /**
   * 组件挂载时初始化
   */
  attached() {
    // 初始化购物车列表（仅挂载时执行一次）
    this.getCartList();
  },

  /**
   * 组件卸载时清理（可选）
   */
  detached() {
    // 清理可能的定时器/订阅
  }
});