const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementUiResolver } = require('unplugin-vue-components/resolvers')


module.exports = {
  lintOnSave:false,
  configureWebpack: {
    plugins: [
        // new BundleAnalyzerPlugin(),
        // Ignore all locale files of moment.js
        AutoImport({
          resolvers: [ElementUiResolver()]
        }),
        Components({
          resolvers: [ElementUiResolver()]
        }),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  
        // 配置compression-webpack-plugin压缩
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100
        })
      ],
      // optimization: {
      //   runtimeChunk: 'single',
      //   splitChunks: {
      //     chunks: 'all',
      //     maxInitialRequests: Infinity,
      //     minSize: 20000,
      //     cacheGroups: {
      //       vendor: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name (module) {
      //           // get the name. E.g. node_modules/packageName/not/this/part.js
      //           // or node_modules/packageName
      //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
      //           // npm package names are URL-safe, but some servers don't like @ symbols
      //           return `npm.${packageName.replace('@', '')}`
      //         }
      //       }
      //     }
      //   }
      // },
    },
  devServer: {
      proxy: {
          '^/api': {
              target: 'http://61.171.112.204:8088/',
              ws:true,
              changeOrigin:true,
              pathRewrite:{
                  '^/api':''
              }
          }
      },
  }
}


