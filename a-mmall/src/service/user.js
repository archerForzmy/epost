import MMUtil from 'util/mm.js';

const _mm = new MMUtil();

export default class User{
    // 检查用于登录的信息是否合法
    checkLoginInfo(userInfo){
    	let username = $.trim(userInfo.username),
    		password = $.trim(userInfo.password);
        if(typeof username!=='string'||username.length===0){
            return {
                status: false,
                msg: '用户名不能为空'
            }
        }
        if(typeof password!=='string'||password.length===0){
            return {
                status: false,
                msg: '密码不能为空'
            }
        }
        return {
            status: true,
            msg: '验证通过'
        }
    }
    // 登录
    login(userInfo){
        return _mm.request({
            url : _mm.getServerUrl('/manage/user/login.do'),
            method : 'POST',
            data : {
                username : userInfo.username || '',
                password : userInfo.password || ''
            }
        });
    }
	// 退出登录
    logout(){
        return _mm.request({
            url     : _mm.getServerUrl('/user/logout.do'),
            method  : 'POST',
        });
    }
    //获取用户列表(分页加载)
    getUserList(pageNum){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/user/list.do'),
            method  : 'POST',
            data:{
                pageNum:pageNum || 1
            }
        });
    }
    //枷锁解锁用户
    onLock(isLock,id){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/user/lock.do'),
            method  : 'POST',
            data:{
                userId:id,
                lock:isLock
            }
        });
    }
}