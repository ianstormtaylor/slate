const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const NamedModulesPlugin = webpack.NamedModulesPlugin
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin

const config = {
  entry: ['./benchmark/index.js'],
  output: {
    path: path.resolve(__dirname, '../../build/'),
    filename: 'benchmark.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            forceEnv: 'benchmark',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new UglifyJSPlugin({ sourceMap: false })],
}

module.exports = config
