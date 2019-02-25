const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    watch: true,
    output: {
        filename: './bundle.js',
    },
    devServer: {
        contentBase: './',
        watchContentBase: true,
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
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
                    {loader: 'postcss-loader'}
                ],
            },
            { test: /\.html$/, loader: 'html-loader' },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './index.html',
            filename: './index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};