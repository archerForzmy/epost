var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// webpack config
var config = {
    entry:'./src/app.js',
    output: {
        //打包在当前路径下的dist文件夹中
        path        : path.resolve(__dirname,'dist'),
        //url访问根路径
        publicPath  : '/dist/',
        //打包后的文件名
        filename    : 'js/app.js'
    },
    //配置目录别名
    resolve: {
        alias: {
            node_modules    : path.join(__dirname, '/node_modules'),
            lib             : path.join(__dirname, '/src/lib'),
            util            : path.join(__dirname, '/src/util'),
            component       : path.join(__dirname, '/src/component'),
            service         : path.join(__dirname, '/src/service'),
            page            : path.join(__dirname, '/src/page'),
        }
    },
    module: {
        rules:[
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,  //排除这个目录下的js
                use:{
                    loader: 'babel-loader', 
                    options: {
                        presets: ['env','react']
                    }
                }
            },
            {
                test: /\.css$/, 
                use:ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback : 'style-loader'
                })
            },
            {
                test: /\.scss$/, 
                use:ExtractTextPlugin.extract({
                    use: ['css-loader','sass-loader'],
                    fallback : 'style-loader'
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:8192,
                            name:'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // html打包的位置
        new HtmlWebpackPlugin({
            template : './src/index.html',
            favicon:'./favicon.ico'
        }),
        // 样式文件打包的位置
        new ExtractTextPlugin('css/[name].css'),
        // 提出公共部分 
        new webpack.optimize.CommonsChunkPlugin({
            name        : 'common',
            filename    : 'js/base.js'
        }),
    ],
    //服务器访问端口
    devServer:{
        port:8086,
        historyApiFallback:{
            index:'/dist/index.html'
        },
        //当访问路径中包括/manage自动讲域名变成指定的
        proxy:{
            '/manage':{
                target:'http://admin.epost.com',
                changeOrigin:true
            },
            '/user/logout.do':{
                target:'http://admin.epost.com',
                changeOrigin:true
            }
        }
    }
};

module.exports = config;