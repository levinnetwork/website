const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 自动清除沉余js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动生成 html 插件
const { SourceMapDevToolPlugin } = require("webpack");

module.exports = {
    entry: './src/index.js', //入口文件
    output: {
        filename: 'bundle.[hash].js', // 默认为main.js  [hash]是为了避免js缓存
        path: path.resolve(__dirname,'./dist') // path为绝对路径，用node path模块转化
    },
    mode: 'none',
    module: { // 加载 css less
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            { 
                test: /\.less$/, 
                use: ['style-loader','css-loader','less-loader'] 
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins:[ // es6 内置函数转换
                        '@babel/plugin-transform-runtime'
                    ]
                  }
                }
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|m4a)$/, // 加载js img 对象、css 中的图片、音频等资源
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //图片大小小于等于limit值，则会以base64形式加载，不会发请求，大于这个值则用file-loader加载
                            limit: 200*1024,
                            esModule: false,
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader:'url-loader',
                        options:{
                            limit:6291456,//默认单位为bytes
                            esModule: false,
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                // use: ['svg-inline-loader']
                use: [
                    {
                        loader:'url-loader',
                        options:{
                            limit:6291456,//默认单位为bytes
                            esModule: false,
                        }
                    }
                ]
            },
            {
                test: /\.html$/, // 加载 img 标签中的图片
                use: [
                  {
                    loader: 'html-withimg-loader',
                    options: {}
                  }
                ]
            }
        ]
    },
    plugins:[ // 存放插件
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板
            filename: 'index.html', // 默认也是index.html
            minify: false,
            hash: true, // 增加hash，避免缓存
        }),
        new CleanWebpackPlugin(),
        new SourceMapDevToolPlugin({
            filename: "[file].map"
        }),
    ],
    devServer:{ // 开发服务器配置
        port: 9000, // 端口号
        progress: true, // 进度条
        contentBase: './static', // 服务默认指向文件夹
        inline: true, // 设置为true，当源文件改变的时候会自动刷新
        historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        hot: true, // 允许热加载
        open: true // 自动打开浏览器
    }
}
