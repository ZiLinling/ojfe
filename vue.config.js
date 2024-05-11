const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const TARGET = "http://localhost:8090/OnlineJudge"
const commonProxy = {
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Referer', TARGET)
  },
  target: TARGET,
  changeOrigin: true,
  pathRewrite: {
    "^/public": "/public",
    "^/api": ""
  }
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
    },
    proxy: {
      "/api": commonProxy,
      "/public": commonProxy
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        '@resource': resolve('static'),
        '@oj': resolve('src/pages/oj'),
        '@admin': resolve('src/pages/admin'),
        '~': resolve('src/components')
      }
    }
  },

})
