<template>
   <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <!-- :title="'标签' +  item" ??? -->
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
        <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
        <article-list :channel_id="channel.id"></article-list>
        <div class='scroll-wrapper'>
          <van-cell-group>
            <van-cell v-for="obj in 20" :key="obj" :title="obj"></van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 显示编辑频道的图标 -->
    <span class="bar_btn" @click="showchanneledit=true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层组件 -->
    <van-action-sheet :round="false" title="编辑频道" v-model="showchanneledit">
      <!-- 放置频道编辑组件 -->
      <!-- 父组件监听选择频道事件 -->
      <channel-edit @addChannel="addChannel" @delChannel="delChannel" :activeIndex="activeIndex" :channels="channels" @selectChannel="seChannel"></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  components: {
    ArticleList, ChannelEdit
  },
  created () {
    this.getMyChannels()
  },
  data () {
    return {
      activeIndex: 0, // 默认启动第0 个标签
      channels: [], // 频道需要的数据
      showchanneledit: false // 编辑频道的显隐藏
    }
  },
  methods: {
    // 获取列表数据渲染
    async getMyChannels () {
      let data = await getMyChannels()
      this.channels = data.channels
      // console.log(data)
    },
    // 切换对应的频道  关闭弹层
    seChannel (id) {
      const index = this.channels.findIndex(item => item.id === id) // 获取切换频道的索引
      this.activeIndex = index // 将他不是 激活标签切换到对应的标签下
      this.showchanneledit = false
    },
    // 删除频道
    async delChannel (id) {
      try {
        await delChannel(id) // 表示删除数据成功
        // 引出自身中channels的数据
        const index = this.channels.findIndex(item => item.id === id)
        // 如果删除的频道再当前激活频道之前或则是当前激活的频道
        // 要把激活的索引往前挪一位
        if (index <= this.activeIndex) {
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          this.channels.splice(index, 1) // 移除当前频道
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '删除失败' })
      }
    },
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel) // 完成写入本地缓存的操作   这只是写入数据
      this.channels.push(channel) // 这步是修改data中的数据
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 编辑频道组件显示样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
