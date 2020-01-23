<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 可选频道 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(channel,i) in channels" :key="channel.id">
          <span class="f12" :class="{red: i === activeIndex}" @click="$emit('selectChannel',channel.id)">{{channel.name}}</span>
          <!-- 通过编辑状态来控制叉号显示隐藏 -->
          <template v-if="i!== 0">
            <!-- 先控制频道是否等于0，在控制叉号显示隐藏 这样语义更好-->
               <van-icon v-show="editing" class="btn" name="cross"></van-icon>
          </template>
          <!-- v-if 优先级大于v-show -->
          <!-- <van-icon v-if="i!== 0" v-show="editing" class="btn" name="cross"></van-icon> -->
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="channels in optionallChannels" :key="channels.id">
          <span class="f12">{{channels.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 是否编辑频道
      allChannels: [] // 用来接收所有的频道
    }
  },
  props: {
    // 接收数据 我的频道
    channels: {
      type: Array,
      default: () => [] //    eslint 要求我们必须用一个函数来声明组函数
    },
    activeIndex: {
      type: Number
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 给所有频道赋值
    }
  },
  created () {
    this.getAllChannels()
  },
  computed: {
    // 可选频道 = 全部频道 -  我的频道
    optionallChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
