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
      '/api': {
        target: 'htp://192.168.9.53:9910',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
})
