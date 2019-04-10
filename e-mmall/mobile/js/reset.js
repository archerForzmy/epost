$(function(){

	$('#btn-submit').on('click',function () {
            var userInfo = {
                    password        : $.trim($('#password').val()),
                    passwordNew     : $.trim($('#password-new').val()),
                    passwordConfirm : $.trim($('#password-confirm').val()),
                },
                validateResult = validateForm(userInfo);
            if(validateResult.status){
                //更改用户密码
                updatePassword({
                    passwordOld : userInfo.password,
                    passwordNew : userInfo.passwordNew
                },function (res,msg) {
                	mui.toast(msg);
                },function (errMsg) {
                   mui.toast(errMsg);
                });
            }else{
                mui.toast(validateResult.msg);
            }
    });
});

// 更新密码
var updatePassword = function(userInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/user/reset_password.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
}

//验证字段信息
var validateForm =function (formData) {
        var result = {
            status:false,
            msg:''
        };
        //原密码是否为空
        if(!_mm.validate(formData.password,'require')){
            result.msg = '原密码不能为空';
            return result;
        }
        //新密码是否大于6位且不能为空
        if(!formData.passwordNew||formData.passwordNew.length<6){
            result.msg = '新密码格式不正确';
            return result;
        }
        //确认密码是否一致
        if(formData.passwordNew != formData.passwordConfirm){
            result.msg = '两次输入密码不一致';
            return result;
        }
        //通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
}