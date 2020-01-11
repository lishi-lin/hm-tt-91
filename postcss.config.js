module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 因为我们做的是手机  手机以iphone为标准为主要适配，设备宽度375px。
      propList: ['*']
    }
  }
}
