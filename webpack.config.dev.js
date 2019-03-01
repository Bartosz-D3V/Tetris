const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/index', './index.html'],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  watch: true,
  output: {
    filename: './bundle.js',
  },
  devServer: {
    hot: true,
    inline: true,
    host: 'localhost',
    port: 8080,
    watchOptions: {
      poll: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer],
            },
          },
        ],
      },
      { test: /\.html$/, loader: 'html-loader' },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: 'index.html',
      minify: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
