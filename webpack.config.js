const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    common: "./src/js/common.js",
    video: "./src/js/video.js",
    app: "./src/js/app.js",
    comment: "./src/js/comment.js"
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
      chunks: ["app", "comment", "video"],
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
  ],
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 10010,
    hot: true,
    overlay: true,
    historyApiFallback: {
    rewrites: [{from: /.*/, to: "/index.html"}]
    }
  }
};