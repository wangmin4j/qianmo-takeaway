import http from '../utils/http'

export const reqIndexData = async () => {
  try {
    // 步骤1：发起两个请求（得到Promise实例）
    const p1 = http.get('user/dish/list?categoryId=22');
    const p2 = http.get('user/dish/list?categoryId=20');
    const p3 = http.get('user/setmeal/list?categoryId=13');
    const p4 = http.get('user/dish/list?categoryId=18')

    // 步骤2：用原生Promise.all解析 → 得到[数组5, 数组4]
    const rawRes = await Promise.all([p1, p2, p3, p4]);
    
    // 步骤3：兜底处理（防止个别请求返回undefined）
    const bannerList = rawRes[0] || [];
    const activeList = rawRes[1] || [];
    const cateList = rawRes[2] || [];
    const hotList = rawRes[3] || [];

    // 步骤4：返回扁平数据（无Promise，纯数组）
    return [bannerList, activeList, cateList, hotList];
  } catch (error) {
    console.error('首页请求失败：', error);
    return [[], []]; // 全失败兜底
  }
}