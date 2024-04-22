const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  pages: {
    oj: {
      entry: "./src/pages/oj/index.js",
      template: "./public/index.html",
      filename: "index.html",
      title: "oj"
    },
    admin: {
      entry: "./src/pages/admin/index.js",
      template: "./src/pages/admin/index.html",
      filename: "admin.html",
      title: "admin"
    }
  },
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false
    }
  },
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
