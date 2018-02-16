const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: './examples/index.js',

  output: {
    path: path.resolve(__dirname, 'examples/dist'),
    filename: '[name].[chunkhash].js',
  },

  devServer: {
    contentBase: './examples',
    publicPath: '/',
  },

  module: {
    rules: [
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
    new ExtractTextPlugin('[name]-[contenthash].css'),
    new HtmlWebpackPlugin({
      title: 'Slate',
      template: HtmlWebpackTemplate,
      inject: false,
      links: [
        'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin-ext',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
      ],
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new CleanWebpackPlugin(['examples/dist']),
    new UglifyJSPlugin({ sourceMap: true }),
    new CopyWebpackPlugin(['examples/CNAME'])
  )
  config.devtool = 'source-map'
} else {
  config.devtool = 'inline-source-map'
}

module.exports = config
