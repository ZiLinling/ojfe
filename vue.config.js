const { defineConfig } = require('@vue/cli-service')
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
  transpileDependencies: true
})
