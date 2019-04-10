require("./index.css");
require("page/common/index.js");
require("page/common/nav/index.js");
require("page/common/header/index.js");
var navSide 		= require("page/common/nav-side/index.js");
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var templateIndex   = require('./index.string');

// page 逻辑部分
var page = {
    init:function () {
        this.onLoad();
    },
    onLoad:function () {
        //初始化左侧菜单
        navSide.init({name:'user-center'});
        //加载用户信息
        this.loadOrderList();
    },
    //加载用户信息
    loadOrderList: function () {
        var userHtml = '';

        /*userHtml = _mm.renderHtml(templateIndex, {
            username:'zmy',
            phone:'18720520869',
            email:'1835060443@qq.com',
            question:'我是谁',
            answer:'神隐少年'
        });
        $('.panel-body').html(userHtml);*/

        _user.getUserInfo(function (res) {
            userHtml = _mm.renderHtml(templateIndex, res);
            $('.panel-body').html(userHtml);
        },function (errMsg) {
            _mm.errorTips(errMsg);
        });
    }
};
$(function () {
    page.init();
});