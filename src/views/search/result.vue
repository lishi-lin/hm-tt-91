<template>
  <div class="container">
    <!-- 导航固定定位 fixed -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 文章列表 -->
    <van-list @load="onLoad" v-model="upLoading" :finished="finished" finished-text="没有更多了">
      <van-cell-group>
        <!-- art_id 有可能十大数字  超过一定长度会转成BigNumber-->
        <van-cell :to="`/article?id=${item.art_id.toString()}`" v-for="item in articles " :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type === 3">
              <!-- 支持图片加载   当图片显示在当前可视区域时  才去请求该图片地址 -->
              <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{ item.pubdate | relTime }}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { serachArticle } from '@/api/article'
export default {
  name: 'searchResult',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载状态
      finished: false, // 是否已经完成了全部的加载
      articles: [], // 存放文章的列表
      page: {
        page: 1, // 表示当前的页码
        per_page: 10 // 表示每页请求10条数据
      }
    }
  },
  methods: {
    async onLoad () {
      let { q } = this.$route.query // 从地址栏解析查询参数
      let data = await serachArticle({ ...this.page, q })
      // 上拉加载的业务  追加到队尾
      this.articles.push(...data.results)
      this.upLoading = false // 关闭状态
      // 根据当前返回的数组长度  如果当前的长度为；0  表示下一页肯定没有数据了
      if (data.results.length) {
        // 若谷不为0
        this.page.page++ // 将页码加1  表示还有下一页数据
      } else {
        this.finished = true //  手动关闭加载状态
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
