<template>
  <!-- 这个div设置了滚动条  目的是给后面做阅读记忆 留下伏笔-->
  <!-- 做上拉加载下拉刷新 -->
  <div class="scroll-wrapper">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 放置list组件可以实现 加载刷新 -->
      <van-list :finished="finished" finished-text="没有了" v-model="upLoading" @load="onLoad">
        <!-- 渲染数据 -->
        <van-cell :to="`/article?id=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type === 3">
              <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-if="item.cover.type === 1">
              <van-image class="w100" fit="cover" :src="item.cover.images[1]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <!-- 使用过滤器   表达式 |  过滤器名称-->
              <span>{{item.pubdate | relTime}}</span>
              <!-- 判断是否显示叉号图标 -->

              <span class="close" v-if="user.token">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import { getArticles } from '@/api/article' // 获取文章列表数据
import { mapState } from 'vuex'
export default {
  name: 'articles',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      articles: [], // 文章列表数据
      downLoading: false, // 是否开启下拉刷新
      refreshSuccessText: '更新成功', // 文本
      timestamp: null // 时间戳  用来告诉服务器 现在我要求什么样的时间的数据
    }
  },
  // 映射vuex中的store对象到计算属性上
  computed: {
    ...mapState(['user'])
  },
  // pros可以对象传参数也可以数组传参数
  props: {
    // 属性名
    channel_id: {
      type: Number, // 指定要穿的props的类型
      default: null, // 给props一个默认值
      required: true // 要求必该props属性毕传 否则报错
    }
  },
  methods: {
    // onload () {
    //   setTimeout(() => {
    //     if (this.articles.length < 50) {
    //       let arr = Array.from(
    //         Array(10),
    //         (value, index) => this.articles.length + index + 1
    //       )
    //       this.articles.push(...arr)
    //       // 关闭状态
    //       this.upLoading = false
    //     } else {
    //       this.finished = true // 告诉list组件 我已经加载完成  不要再触发  onload事件
    //     }
    //   }, 1000)
    // },
    // 加载列表数据
    async onLoad () {
      // 延迟处理函数
      await this.$sleep()
      // await this.$sleep() // 等待 sleep  resovle
      // 第一次加载，时间戳是空的，为空就传当前时间
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      // 追加数据到末尾
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      // 判断历史时间戳，如果你有历史，表示我可以继续往下看，否则就不看了
      // pre_timestamp请求前一页历史数据的时间戳
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        // 如果没有timestamp就是没历史了  没有必要加载了
        this.finished = true
      }
    },
    // onRefresh () {
    //   console.log('下拉刷新')
    //   let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
    //   this.articles.unshift(...arr)
    //   this.downLoading = false
    //   this.refreshSuccessText = `更新了${arr.length}条数据`
    // }
    // 下拉刷新 获取的永远是最新数据
    async onRefresh () {
      // 延迟处理函数
      await this.$sleep(3000) // 等待sleep resolve
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      // 加载数据成功后，关闭下拉刷新状态
      this.downLoading = false
      // 有可能没有最新数据
      if (data.results.length) {
        // 如果长度大于0 表示还有数据
        this.articles = data.results // 将历史数据全部覆盖掉
        // 如果有数据 表示能进行上拉加载
        this.finished = false
        // 我们依然获取此次的历史事件戳
        this.timestamp = data.pre_timestamp // 赋值历史时间戳 因为当你下拉刷新之后 上拉加载的时候
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        // 无更新数据变化   什么都不需要变化
        this.refreshSuccessText = '暂无数据更新'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
