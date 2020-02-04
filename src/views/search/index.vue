<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框 -->
    <!-- trim 自动去空格 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="toSearchResult(item)" icon="search" v-for=" item in suggestionList" :key="item">
        <span>{{item}}</span>
      </van-cell>
    </van-cell-group>

    <!-- 历史记录 -->
    <!-- 只有当有历史纪录的时候  才显示整个历史纪录的盒子 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 清空历史 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <!-- 循环生成历史纪录  item是唯一的  搜索历史纪录不应该重复 -->
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="item">
          <!-- item就是搜索的关键字 -->
          <a class="word_btn">{{ item }}</a>
          <van-icon
            @click.stop="delHistory(index)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggestion } from '@/api/article'
const key = 'hm-91-toutiao-history' // 用来当作存储本地历史纪录的key
export default {
  name: 'search',
  data () {
    return {
      // v-model 用于控制搜索框中的文字
      q: '', // 查询内容
      historyList: [], // 历史纪录数据
      suggestionList: [] // 存放联想建议的数组
    }
  },
  watch: {
    // 防抖搜索
    // q () {
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //   // 搜索联想的词汇
    //     if (!this.q) {
    //       this.suggestionList = [] // 当搜索关键字变成空的时候  将联想数组清
    //      直接返回下面不在执行
    //          }
    //     let data = await suggestion({ q: this.q }) // 搜索联想建议
    //     this.suggestionList = data.options
    //   }, 500)
    // }

    // 节流搜索
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null
          if (!this.q) {
            this.suggestionList = [] // 当搜索关键字变成空的时候  将联想数组清
            return false // 直接返回下面不在执行
          }
          let data = await suggestion({ q: this.q })
          this.suggestionList = data.options
        }, 500)
      }
    }
  },
  // created () {
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 读取本地的内容
  // },
  methods: {
    // 删除对应的历史记录
    delHistory (index) {
      this.historyList.splice(index, 1) // 删除对应的索引
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入本地缓存
    },
    // 跳转到搜索页面
    toResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } }) // 直接跳转搜索界面
    },
    // 清空所有历史
    clear () {
      this.historyList = [] // 清空所有历史
      localStorage.setItem(key, '[]') // 写入缓存
    },
    // 回车虚拟键盘搜索
    onSearch () {
      // 跳转搜索结果页面 ，而且也要携带参数Q
      if (!this.q) return // 如果q为空没有必要往下走
      // 如果不为空则对数据数组进行去重  new set
      let obj = new Set(this.historyList) // 生成一个set变量，是对象形式的  set对象自动去重
      // 把搜索记录添加到历史记录
      obj.add(this.q)
      // 将set对象转回数组
      this.historyList = Array.from(obj)
      // 重新写入缓存数据
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 也要跳转到搜索结果页面
      this.$router.push({ path: './result', query: { q: this.q } })
    },
    toSearchResult (text) {
      let obj = new Set(this.historyList) // 生成一个set变量，是对象形式的  set对象自动去重
      // 把搜索记录添加到历史记录
      obj.add(text)
      // 将set对象转回数组
      this.historyList = Array.from(obj)
      // 重新写入缓存数据
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 也要跳转到搜索结果页面
      this.$router.push({ path: './result', query: { q: text } })
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 读取本地化的内容
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
