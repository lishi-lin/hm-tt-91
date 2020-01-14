<template>
  <!-- 这个div设置了滚动条  目的是给后面做阅读记忆 留下伏笔-->
  <!-- 做上拉加载下拉刷新 -->
  <div class="scroll-wrapper">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 放置list组件可以实现 加载刷新 -->
      <van-list :finished="finished" finished-text="没有了" v-model="upLoading" @load="onload">
        <!-- 渲染数据 -->
        <van-cell v-for="item in articles" :key="item">
          <div class="article_item">
            <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
            <div class="img_box">
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box">
              <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="info_box">
              <span>你像一阵风</span>
              <span>8评论</span>
              <span>10分钟前</span>
              <span class="close">
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
export default {
  name: 'article',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      articles: [], // 文章列表数据
      downLoading: false, // 是否开启下拉刷新
      refreshSuccessText: '更新成功' // 文本
    }
  },
  methods: {
    onload () {
      setTimeout(() => {
        if (this.articles.length < 50) {
          let arr = Array.from(
            Array(10),
            (value, index) => this.articles.length + index + 1
          )
          this.articles.push(...arr)
          // 关闭状态
          this.upLoading = false
        } else {
          this.finished = true // 告诉list组件 我已经加载完成  不要再触发  onload事件
        }
      }, 1000)
    },
    onRefresh () {
      console.log('下拉刷新')
      let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
      this.articles.unshift(...arr)
      this.downLoading = false
      this.refreshSuccessText = `更新了${arr.length}条数据`
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
