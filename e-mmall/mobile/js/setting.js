 $(function(){
 	$('#abort').on('tap',function(){
 		mui.toast("作者：神隐少年<br/>版本：V1.1.0");
 	});

 	$('#logout').on('tap',function(){
 		logout(function(res){
 			window.location.href="./login.html";
 		},function(err){

 		});
 	});

 	checkLogin(function(res){
        $("#username").html(res.username);
        $("#account").html('账号：'+res.email);
    }, function(errMsg){
            // do nothing
    });
 });

// 获取用户信息
var getUserInfo = function(resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/get_information.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}

var logout = function(resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/logout.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}

var checkLogin = function(resolve,reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/get_user_info.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}