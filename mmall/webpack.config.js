 var webpack             =  require("webpack");
 var ExtractTextPlugin   = require('extract-text-webpack-plugin');
 var HtmlWebpackPlugin   = require('html-webpack-plugin');

 // 环境变量配置，dev / online
 var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';

 // 获取html-webpack-plugin参数的方法   name是html文件名和js模块名 
 var getHtmlConfig = function(name, title){
    return {
        template    : './src/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        favicon     : './favicon.ico',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['common', name]       //html页面要引用的js文件模块
    };
 };

 var config = {
  	entry: {
  		'common':['./src/page/common/index.js'],
  		'index':['./src/page/index/index.js'],
      'result':['./src/page/result/index.js'],
      'register':['./src/page/register/index.js'],
      'reset':['./src/page/reset/index.js'],
      'center':['./src/page/center/index.js'],
      'user-update':['./src/page/user-update/index.js'],
      'pass-update':['./src/page/pass-update/index.js'],
      'list':['./src/page/list/index.js'],
      'product':['./src/page/product/index.js'],
      'seckill':['./src/page/seckill/index.js'],
      'cart':['./src/page/cart/index.js'],
      'order-confirm':['./src/page/order-confirm/index.js'],
      'order-seckill':['./src/page/order-seckill/index.js'],
      'order-list':['./src/page/order-list/index.js'],
      'order-detail':['./src/page/order-detail/index.js'],
      'payment':['./src/page/payment/index.js'],
      'about':['./src/page/about/index.js'],
  		'login':['./src/page/login/index.js']
 	  },
  	output:{
  		path:__dirname + '/dist',   //最好使用绝对路径
      //访问url相对于webpack-dev-server主机下   如果是成产环境就加上主机名
      //publicPath:'dev' === WEBPACK_ENV ? '/dist/' : '//s.epost.com/mmall/dist/',    
      publicPath:'/dist/',    
  		filename:'js/[name].js'
  	},
    module: {
      loaders:[
        {
          test:/\.css$/,
          loader:ExtractTextPlugin.extract("style-loader","css-loader")
        },
        {
          test:/\.(png|jpg|gif|woff|svg|eot|ttf)\??.*$/,
          loader:'url-loader?limit=2048&name=resource/[name].[ext]'
          //大于2k的图片被解析成图片文件其他被解析成base64字符串
        },
        {
           test  : /\.string$/,
           loader: 'html-loader',
           query : {
              minimize             : true,
              removeAttributeQuotes: false    //不要删除标签属性上的引号
           }
        }
      ]
    },
  	externals:{
 		  'jquery':'window.jQuery'
  	},
    resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
            image           : __dirname + '/src/image'
        }
    },
  	plugins: [
  		new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
    	}),
      //将css单独打包成文件
      new ExtractTextPlugin("css/[name].css"),
      //html模板处理
      new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
      new HtmlWebpackPlugin(getHtmlConfig('register','注册')),
      new HtmlWebpackPlugin(getHtmlConfig('login','登录')),
      new HtmlWebpackPlugin(getHtmlConfig('reset','密码找回')),
      new HtmlWebpackPlugin(getHtmlConfig('center','个人中心')),
      new HtmlWebpackPlugin(getHtmlConfig('user-update','修改信息')),
      new HtmlWebpackPlugin(getHtmlConfig('pass-update','修改密码')),
      new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
      new HtmlWebpackPlugin(getHtmlConfig('product','商品详情')),
      new HtmlWebpackPlugin(getHtmlConfig('seckill','秒杀详情')),
      new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
      new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
      new HtmlWebpackPlugin(getHtmlConfig('order-seckill','秒杀订单')),
      new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
      new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
      new HtmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
      new HtmlWebpackPlugin(getHtmlConfig('about','关于系统')),
      new HtmlWebpackPlugin(getHtmlConfig('result','结果'))
    ]
};

//开发环境就配置webpack-dev-server
if('dev' === WEBPACK_ENV){
  config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports= config;