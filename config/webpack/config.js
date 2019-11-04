const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const IS_PROD = process.env.NODE_ENV === 'production'
const IS_DEV = !IS_PROD

const config = {
  mode: 'development',
  entry: './examples/index.js',
  output: {
    path: path.resolve(__dirname, '../../build'),
    filename: '[name]-[hash].js',
  },
  devtool: IS_PROD ? 'source-map' : 'inline-source-map',
  devServer: {
    contentBase: './examples',
    publicPath: '/',
    hot: true,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            envName: 'webpack',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Slate',
      template: HtmlWebpackTemplate,
      inject: false,
      // Note: this is not the correct format meta for HtmlWebpackPlugin, which
      // accepts a single object of key=name and value=content. We need to
      // format it this way for HtmlWebpackTemplate which expects an array of
      // objects instead.
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
      links: [
        'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin-ext',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
      ],
    }),
    IS_PROD && new CopyWebpackPlugin(['examples/CNAME']),
  ].filter(Boolean),
}

module.exports = config
