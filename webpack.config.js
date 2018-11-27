const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash:5].bundle.js",
    chunkFilename: "[name]-[hash:5].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ["img:src"]
            }
          }
        ]
      },
      {
        test: /\.css/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader',
          },
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true,
              }
            },
            {
              loader: "postcss-loader"
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|jpeg|eot|ttf|svg|woff|webp)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 10000,
              publicPath: "static/",
              output: "static/",
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
      chunks: ["app"],
      minfiy: {
        collapseWhitespace: true
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextWebpackPlugin({
      filename: "[name].min.css",
      allChunks: true
    })
    // new webpack.ProvidePlugin({
    //   $: "jquery"
    // })
  ],
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 10010,
    hot: true,
    overlay: true,
    // proxy: {
    //   "/comments": {
    //     target: "http",
    //     changeOrigin: true,
    //     logLevel: "debug",
    //     headers: {
    //       Cookie: ""
    //     }
    //   }
    // }
    historyApiFallback: {
    rewrites: [{from: /.*/, to: "/index.html"}]
    }
  }
};