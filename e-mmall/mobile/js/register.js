$(function(){
	//获取表单参数
	 $('#register').on('tap',function(){
        /*获取数据*/
        var formData = {
            username:$.trim($('[name="username"]').val()),
            password:$.trim($('[name="password"]').val()),
            passwordConfirm:$.trim($('[name="passwordConfirm"]').val()),
            phone:$.trim($('[name="phone"]').val()),
            email:$.trim($('[name="email"]').val()),
            question:$.trim($('[name="question"]').val()),
            answer:$.trim($('[name="answer"]').val())            
        };
        var validateResult = formValidate(formData);
        if(validateResult.status){
            /*发送数据*/
            register(data,function (res) {
                //重定向页面
                window.location.href = window.mm.getUrlParam('redirect') || './index.html'
            },function (errMsg) {
            
            });
        }else{
            mui.toast(validateResult.msg);
        }
    });  
 

});

var formValidate = function (formData) {
        var result = {
            status:false,
            msg:''
        };
        if(!window.mm.validate(formData.username,'require')){
            result.msg = '用户名不能为空';
            return result;
        }
        if(!window.mm.validate(formData.password,'require')){
            result.msg = '密码不能为空';
            return result;
        }
        //密码不能太短
        if(formData.password.length < 6){
            result.msg = '密码不能少于6字符';
            return result;
        }
        //两次密码是否一致
        if(formData.password !== formData.passwordConfirm){
            result.msg = '两次密码不一致';
            return result;
        }
        //验证手机号
        if(!window.mm.validate(formData.phone,'phone')){
            result.msg = '手机号格式不正确';
            return result;
        }
        //验证邮箱
        if(!window.mm.validate(formData.email,'email')){
            result.msg = '邮箱格式不正确';
            return result;
        }
        //密码提示问题
        if(!window.mm.validate(formData.question,'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        //密码提示问题答案
        if(!window.mm.validate(formData.answer,'require')){
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        //通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
}

var register = function(userInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/register.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}