$(function(){
 	getUserInfo(function(res){
 		$('#username').html(res.username);
 		$('#account').html(res.email);
 		$('#phone').html(res.phone);
 		$('#email').html(res.email);
 		$('#question').html(res.question);
 		$('#answer').html(res.answer);
 	},function(err){

 	})
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