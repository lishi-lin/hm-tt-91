// 专门处理频道的请求
import request from '@/utils/request' // 引入封装的模块
// 标题 获取我的频道数据
export function getMyChannels () {
  // 返回一个Promise axios 默认就是get类型
  return request({
    url: '/user/channels'
  })
}
// 获取所有频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
