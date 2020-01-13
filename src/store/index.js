import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  // 放置数据的地方 初始化的时候直接将用户信息给我们的公共状态
  state: {
    // user代表的是传入的信息
    user: auth.getUser()
  },
  mutations: {
    // 修改用户信息 user对象
    updateUser (state, user) {
      state.user = user
      // 更新本地 (当你刷新页面的时候，默认获取的是本地的用户信息)
      auth.setUser(user)
    },
    clearUser (state) {
      state.user = ''
      auth.delUser() // 将缓存中的数据也清空
    }
  },
  actions: {
  },
  modules: {
  }
})
