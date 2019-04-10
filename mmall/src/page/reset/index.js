require("./index.css");
require("page/common/nav-simple/index.js");
var _mm = require('util/mm.js');
var _user   = require('service/user-service.js');

// 表单错误提示
var formError = {
    show:function (errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide:function () {
        $('.error-item').hide().find('.err-msg').text('');
    }
};

//页面逻辑部分
var page = {
    data:{
        username    : '',
        question    : '',
        answer      : '',
        token       : ''
    },
	init:function () {
        //显示第一个步骤
        this.onLoad();
		//事件绑定
        this.bindEvent();
    },
    bindEvent:function () {
        var _this = this;
        // 下一步按钮点击事件（根据用户名获取找回密码的问题）
        $('#submit-username').click(function () {
            var username = $.trim($('#username').val());
            if(username){
                _user.getQuestion(username,function (res) {
                    _this.data.username = username;
                    _this.data.question = res;
                    _this.loadStepQuestion();
                },function (errMsg) {
                   formError.show(errMsg);
                });
            }else{
                formError.show('请输入用户名');
            }
        });
        // 下一步按钮点击事件（获取找回问题答案的正确性）
        $('#submit-question').click(function () {
            var answer = $.trim($('#answer').val());
            if(answer){
                _user.checkAnswer({
                    username:_this.data.username,
                    question:_this.data.question,
                    answer : answer
                },function (res) {
                    _this.data.answer = answer;
                    _this.data.token = res;
                    _this.loadStepPassword();
                },function (errMsg) {
                    formError.show(errMsg);
                });
            }else{
                formError.show('请输入密码提示问题答案');
            }
        });
        //输入新密码后按钮点击事件（前题答案是正确的）
        $('#submit-password').click(function () {
            var password = $.trim($('#password').val());
            if(password && password.length >=6){
                _user.resetPassword({
                    username    :_this.data.username,
                    passwordNew :password,
                    forgetToken :_this.data.token
                },function (res) {
                    window.location.href = './result.html?type=pass-reset';
                },function (errMsg) {
                    formError.show(errMsg);
                });
            }else{
                formError.show('请输入不少于6位新密码');
            }
        });
    },
    //加载输入用户名
    loadStepUsername : function () {
        $('.step-username').show();
    },
    //加载输入密保问题答案
    loadStepQuestion : function () {
        formError.hide();
        $('.step-username').hide()
            .siblings('.step-question').show()
            .find('.question').text(this.data.question);
    },
    //加载输入新密码
    loadStepPassword : function () {
        formError.hide();
        $('.step-question').hide()
            .siblings('.step-password').show();
    },
    onLoad:function () {
        this.loadStepUsername();
    }
};


$(function () {
    page.init();
});