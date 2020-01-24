// 专门处理频道的请求
import request from '@/utils/request' // 引入封装的模块
import store from '@/store'
// 本地缓存需要key
const CACHE_CHANNEL_T = 'hm-91-toutiao-t' // 游客缓存的key
const CACHE_CHANNEL_U = 'hm-91-toutiao-u' // 登录用户的key
// 标题 获取我的频道数据
export function getMyChannels () {
  // 返回一个Promise axios 默认就是get类型

  // 首先我们应该 先从缓存中读取 看看缓存中有没有  如果缓存中有的话 用缓存的数据  如果缓存中没有的话才会去查询

  // return request({
  //   url: '/user/channels'
  // })

  return new Promise(async function (resolve, reject) {
    // 判断是否有token
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    // 有token，从缓存中获取数据
    let str = localStorage.getItem(key) // 得到缓存结果
    if (str) {
      //  如果str存在 表示缓存中有数据
      resolve({ channels: JSON.parse(str) }) // 表示从缓存中获取的数据 通过执行链下发给下一个promise
    } else {
      // 如果没有数据
      const data = await request({ url: '/user/channels' }) // 从线上拉取数据
      localStorage.setItem(key, JSON.stringify(data.channels)) // 将线上数据写入缓存
      resolve(data) // 将线上获取的数据释放下给promise
    }
  })
}
// 获取所有频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
// 删除频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 首先也需要做判断  是删除 游客的频道还是删除登入的频道
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    const channels = JSON.parse(localStorage.getItem(key)) // 得到缓存结果一定是有数据的
    const index = channels.findIndex(item => item.id === id) // 找到对应的索引
    // 判断索引是否大于-1
    if (index > -1) {
      // 移除对应的索引
      channels.splice(index, 1)
      // 移除后的数据重新设置到缓存中
      localStorage.setItem(key, JSON.stringify(channels)) // 删除对应的索引 重新写入缓存
      // 成功之后
      resolve()
    } else {
      reject(new Error('找不到对应的频道'))
      // 失败之后
    }
  })
}
