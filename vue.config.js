const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const pages = {
  oj: {
    entry: "./src/pages/oj/index.js",
    template: "./public/index.html",
    filename: "index.html",
    title: "oj"
  },
  // admin: {
  //   entry: './src/pages/admin/index.js',
  // },
}
module.exports = defineConfig({
  pages: pages,
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@oj': resolve('src/pages/oj'),
        '@admin': resolve('src/pages/admin')
      }
    }
  },
})
