var _mm = require('util/mm.js');

var _user = {
    // 用户登录
    login:function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/login.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 用户注册
    register:function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/register.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查用户名
    checkUsername:function(username, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/check_valid.do'),
            data    : {
                type    :'username',
                str     :username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查登陆状态
    checkLogin:function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUri('/user/get_user_info.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout:function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/logout.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 根据用户名获取提示问题
    getQuestion:function(username, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/forget_get_question.do'),
            data    : {
              username : username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //验证找回密码问题是否正确
    checkAnswer:function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/forget_check_answer.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //更新密码
    resetPassword:function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/forget_reset_password.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户信息
    getUserInfo:function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/get_information.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 更新用户信息
    updateUserInfo:function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/update_information.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 更新密码
    updatePassword:function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/user/reset_password.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
};

module.exports = _user;