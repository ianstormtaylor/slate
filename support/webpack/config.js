const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const DefinePlugin = webpack.DefinePlugin
const NamedModulesPlugin = webpack.NamedModulesPlugin
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
const IS_PROD = process.env.NODE_ENV === 'production'
const IS_DEV = !IS_PROD

const config = {
  entry: [
    'babel-polyfill',
    // COMPAT: Missing in IE 11 and included separately because babel-polyfill does not support DOM elements:
    // https://github.com/zloirock/core-js/issues/317
    'element-closest',
    'react-hot-loader/patch',
    './examples/index.js',
  ],
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
            forceEnv: 'webpack',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        IS_PROD ? 'production' : 'development'
      ),
    }),
    new ExtractTextPlugin('[name]-[contenthash].css'),
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
    IS_PROD && new UglifyJSPlugin({ sourceMap: true }),
    IS_DEV && new NamedModulesPlugin(),
    IS_DEV && new HotModuleReplacementPlugin(),
  ].filter(Boolean),
}

module.exports = config
