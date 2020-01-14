// 路由拦截器   ---导航守卫（路由发生变化的时候，就会触发导航守卫）
// permisition 权限的意思
// import router from '@/router' // 引入路由是咧
// 导航守卫 分为：前置守卫，后置守卫
import router from '@/router'
import store from '@/store'
// 前置守卫： 当你的路由发生改变之前触发
// to 到哪里去
// from 从哪里来
// next 函数 => 必须 next() => resolve 这个钩子  => 前面不执行next  => 后面永远不执行
// next(false) // 终止当前的跳转
// next(地址) // 跳到另外一个地址
// next() 放行
router.beforeEach((to, from, next) => {
  //  拦截 判断有无token  有token => 放行 没有token => 登录
  if (to.path.startsWith('/user') && !store.state.user.token) {
    let toPath = { path: '/login',
      query: { redirectUrl: to.path // 携带要去的地址到登录页 => 登录成功之后  有了权限 再回到刚才没有权限去的地址
      }
    }
    next(toPath)
  } else {
    next() // 直接放行
  }
})
export default router
