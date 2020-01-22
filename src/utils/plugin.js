// 导入处理时间格式插件
import dayjs from 'dayjs'
// 相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 引入中文语言包
dayjs.extend(relativeTime) // 扩展相对时间这个方法
export default {
  // Vue.use(obj) => 会调用obj 中的install方法
  install (Vue) {
    //   插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params }) // 小伎俩
    Vue.prototype.$sleep = sleep // 封装一个休眠函数
    Vue.filter('relTime', relTime) // 注册一个全局的相对时间过滤器
  }
}
//  time = 500意思为  如果传time 就用time  否则用默认的500秒
function sleep (time = 500) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), time) // 表示等time时间之后 才能执行resolve函数
  })
}
// 相对时间的过滤器 得到一个相对时间
/**
 * value值我们认为就是时间
**/
function relTime (value) {
  return dayjs().locale('zh-cn').from(value)
}
