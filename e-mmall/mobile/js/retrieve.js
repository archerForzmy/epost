var data = {
        username    : '',
        question    : '',
        answer      : '',
        token       : ''
}

$(function(){
    $('#question').hide();
    $('#pass').hide();

	//获取提示问题
	 $('#next').on('tap',function(){
        /*获取数据*/
        data.username=$('[name="username"]').val();
        /*校验数据*/
        if(!data.username){
            mui.toast('请输入用户名');
            return false;
        }
        /*发送数据*/
        getQuestion(data.username,function (res) {
            //重定向页面
            data.question = res;
            $('#retrieve').hide();
            $('#question').show();
            $('#prompt').html("密码提示问题："+data.question);   
        },function (errMsg) {
            mui.toast(errMsg);
        });
    });  
 
    //验证密码
    $("#answer").on('tap', function(event) {
        var answer = $.trim($('#ans').val());
        if(answer){
            checkAnswer({
                username:data.username,
                question:data.question,
                answer : answer
            },function (res) {
                data.answer = answer;
                data.token = res;
                $('#question').hide();
                $('#pass').show();
            },function (errMsg) {
                mui.toast(errMsg);
            });
        }else{
            mui.toast('请输入密码提示问题答案');
        }
    });
    //重置密码
    $("#password").on('tap', function(event) {
        var password = $.trim($('#passwordNew').val());
        if(password && password.length >=6){
                resetPassword({
                    username    :data.username,
                    passwordNew :password,
                    forgetToken :data.token
                },function (res) {
                    setTimeout(function(){
                        window.location.href = './login.html';
                    },1000);
                    mui.toast('重置密码成功');
                },function (errMsg) {
                    fmui.toast(errMsg);
                });
        }else{
                mui.toast('请输入不少于6位新密码');
        }
    });
});

// 根据用户名获取提示问题
var getQuestion = function(username, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/forget_get_question.do'),
            data    : {
              username : username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}
//验证找回密码问题是否正确
var checkAnswer = function(userInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/forget_check_answer.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}
//更新密码
var resetPassword = function(userInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/forget_reset_password.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}