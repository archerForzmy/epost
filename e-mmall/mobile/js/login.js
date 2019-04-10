$(function(){
	//获取表单参数
	 $('#login').on('tap',function(){
        /*获取数据*/
        var data = {
            username:$('[name="username"]').val(),
            password:$('[name="password"]').val()
        };
        /*校验数据*/
        if(!data.username){
            mui.toast('请输入用户名');
            return false;
        }
        if(!data.password){
            mui.toast('请输入密码');
            return false;
        }
        /*发送数据*/
        login(data,function (res) {
            //重定向页面
            window.location.href = window.mm.getUrlParam('redirect') || './index.html'
        },function (errMsg) {
            
        });
    });  
 

});

var login = function(userInfo, resolve, reject){
    window.mm.request({
            url     : window.mm.getServerUri('/user/login.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
    });
}