// 用户相关的请求模块
import request from '@/utils/request' // 引入封装的模块
// 标题获取数据
export function getMyChannels () {
  // 返回一个Promise axios 默认就是get类型
  return request({
    url: '/user/channels'
  })
}
