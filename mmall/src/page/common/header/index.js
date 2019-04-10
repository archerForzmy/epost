require('./index.css');
var _mm = require('util/mm.js');

var header = {
	init : function(){
		//如果访问首页带有关键字就要将关键字读取出来回显到输入框内
		this.onLoad();
		//初始化事件
        this.bindEvent();
    },
    onLoad : function () {
        var keyword = _mm.getUrlParam('keyword');
        if(keyword){
            //keyword存在，则回填输入框
            $('#search-input').val(keyword);
        }
    },
    bindEvent : function(){
        var _this = this;
        $('#search-btn').click(function () {
            //点击搜索按钮，做提交
            _this.searchSubmit();
        });
        //输入回车后做提交
        $('#search-input').keyup(function(e){
            if(e.keyCode===13){
                _this.searchSubmit();
            }
        })
    },
    //搜索的提交
    searchSubmit : function () {
        var keyword = $.trim($('#search-input').val());
        // 如果提交的时候有keyword，正常跳转到list页；
        if(keyword){
            window.location.href = './list.html?keyword=' + keyword;
        }else{
            //keyword为空，直接返回首页
            _mm.goHome();
        }
    }
};
module.exports  = header.init();