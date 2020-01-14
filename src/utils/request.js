//  封装request模块 request请求拦截器
// 为什么封装request？因为要在拦截器里处理，请求token，响应数据，处理大数字，token失效
import axios from 'axios'
import JSONBig from 'json-bigint' // 处理大数字插件
import store from '@/store'
import router from '@/router'

// 创建一个新的插件实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 配置基准地址
  // transformResponse转化原始数据（json格式字符窜）
  transformResponse: [function (data) {
    // transform 是。。。转化
    // data是原始数据，是json格式字符串，把字符串转化成对象并且返回 默认的是JSON.parse()
    // 如果data睡个空字符串 直接转化就会报错 处理方法如下两种：

    // return data? JSON.parse(data) : {}
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data // 若果失败就把字符串直接返回
    }
  }]// 处理后台返回的数据 字符串 => 对象 JSON.parse(),因为json转化会有最大安全数值，所以用
  // JSONBig.parse()转化数据
}) // 创建一个新的axios的请求工具

// 拦截器

// 请求拦截器: 发起请求 => 请求拦截器  => 服务器  => 统一注入token
// 响应拦截器: 服务器  =>  响应拦截器   => then  await
// 请求拦截器                             config就是请求参数
instance.interceptors.request.use((config) => {
  // 应该在返回配置之前  往配置里塞入token 老师
  // 请求如果成功了就给请求头设置token，用于以后获取数据
  if (store.state.user.token) {
    // 如果有token就注入，没有token就不注入
    config.headers['Authorization'] = `Bearer ${store.state.user.token}` // 统一注入token
  }
  // 配置信息
  return config
}, error => {
  // 请求失败直接返回一个promise错误对象
  return Promise.reject(error)
})
// 响应拦截器
instance.interceptors.response.use(response => {
  // 响应成功,就返回的到的响应数据
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async error => {
  // 响应错误的时候 token容易失效 处理token失效的问题
  // 如何判断token失效
  // error  => config (当前请求 的配置) request(请求) response(响应)
  // 先判断token以及响应状态
  if (error.response && error.response.status === 401) {
    // 判断响应状态吗是否等于401， 如果等于401在判断有没有refresh_token
    let toPath = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
    // toPath获取当前页面地址 跳转到回登录页
    // 表示token过期  判断有没有refresh_token
    if (store.state.user.refresh_token) {
      try {
        let result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` },
          method: 'put'
        })

        store.commit('updateUser', {
          user: {
            token: result.data.data.token, // axios发送数据拿到新token重新赋值
            refresh_token: store.state.user.refresh_token // 将新的refresh_token覆盖以前的
          }
        })// 更新vuex的数据 也更新了本地缓存数据
        return instance(error.config) // 把刚才错误的请求再次发送出去 然后将promise返回
      } catch (error) {
        //  如果错误:没有refre_token，表示补救措施也没用了 应该跳转到登录页 并且 把废掉的user全都干掉
        store.commit('clearUser') // 所有的用户信息清空
        router.push(toPath)
      }
      // 发送新的请求   用原有axios方法发送,如果用instace发送会被拦截，在次执行上面代码token是失效的token
    } else {
      // 连refresh_token 都没有
      //  当访问 页面时 => 去登录 => 登录成功之后 => 回到之前的页面  记住当前的地址 => 登录页面 => 读取地址  => 跳到地址
      //  params 动态路由  user/:id
      // query传参  user? id=123
      //   获取当前页面地址 跳转到回登录页
      router.push(toPath) //
    }
  }
  return Promise.reject(error)
})
export default instance // 导出request工具
// axios.defaults.baseURL 是对原来的默认的axios进行设置
// axios.create,是创建一个新的axios实例
