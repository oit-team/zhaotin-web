const { defineConfig } = require('@vue/cli-service')
const rimraf = require('rimraf')

const pkg = require('./package')

// 输出目录，格式：项目名@环境
const outputDir = `${pkg.name}@${process.env.NODE_ENV}`

// 清理压缩包
rimraf(`${outputDir}.{zip,7z}`, () => {})

module.exports = defineConfig({
  publicPath: './',
  outputDir,
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    proxy: {
      [process.env.VUE_APP_BASE_URL]: {
        target: process.env.VUE_APP_HOST,
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_URL}`]: '',
        },
      },
    },
  },
})
