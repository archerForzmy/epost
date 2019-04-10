require("./index.css");
require("page/common/index.js");
require('page/common/header/index.js');
require('page/common/nav/index.js');
var navSide 		= require("page/common/nav-side/index.js");

// page 逻辑部分
var page = {
    init:function () {
        this.onLoad();
    },
    onLoad:function () {
        //初始化左侧菜单
        navSide.init({name:'about'});
    }
};
$(function () {
    page.init();
});
