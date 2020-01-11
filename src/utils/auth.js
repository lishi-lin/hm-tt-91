// utils：工具管理。。砖门处理用户信息的存储和删除 以及获取 放置在 localStorge
const USER_TOKEN = 'hm-tt-91' // 定义一个这个key专门用来存储 用户信息

export function setUser (user) {
  // 设置用户信息要把获取到的数据转换成json格式字符串
  // localStorage只支持存字符串数据,保存先调用JSON.stringify转为字符串
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 读取用户信息       要把获取到的数据转换成json格式对象
export function getUser () {
  // 为什么把token设置localStorage中，因为localStorage在浏览器关闭后依然存在token 特别适合移动端
  return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}')
  // (USER_TOKEN) || '{}')为短路表达式。当没有数据的时候，给个空对象
}
// 设置用户信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
