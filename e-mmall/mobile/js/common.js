window.ct ={};
//将url参数转换长map集合
ct.getKeysByUrl = function(){
		var params = {};
		//获取url参数
		var search = location.search;
		//如果有参数就将参数转换键值数组
		if(search){
			search = search.replace("?","");
			var arr = search.split("&");
			arr.forEach( function(element, index) {
				var itemArr = element.split("=");
				params[itemArr[0]] =itemArr[1]; 
			});
		}
		return params;
}


/*登录拦截*/
ct.loginAjax = function(params){
	$.ajax({
		type:params.type||'get',
		url:params.url||'#',
		data:params.data||'',
		dataType:params.dataType||'json',
		success:function(data){
			//没有登录
			if(data.error = 400){
				//跳转到登录页面，同时记录下当前页面，将来登录完了要返回这个页面
				location.href='login.html'+'?returnHref='+location.href;
				return false;
			}else{
				//继续其他业务
				params.success&&params.success(data);
			}
		},
		error:function(){
			mui.toast('服务器繁忙');
		}
	}); 
	//params.success&&params.success({success:true});
}


var conf ={
	serverHost:'http://www.epost.com/epost'
};
var _mm = {
	//封装ajax请求
	request:function(param){ 
		var self = this;
		$.ajax({
			type	:param.method 	|| 'post',
			url		:param.url		|| '',
			dataType:param.type 	|| 'json',
			data 	:param.data 	|| '',
			xhrFields:{withCredentials:true},
			success	:function(res){
				//请求成功
				if(0 === res.status){
					//回调方法
					typeof param.success === 'function' && param.success(res.data,res.msg);
				//判断是否已经登陆
				}else if(10 === res.status){
					//强行登陆
					self.doLogin();
				}
				//请求json数据错误
				else if(1 === res.status){
					//回调方法
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			error	:function(err){
				//回调方法
				typeof param.error === 'function' && param.error(err.statusText);
			}
		});
	},
	//获取服务端地址
	getServerUri:function(path){
		return conf.serverHost+path;
	},
	//获取连接的url参数(参数是参数名字)
	getUrlParam:function(name){
		var reg = new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
		//获取url后面？后的参数（包括？）
		var result = window.location.search.substr(1).match(reg);
		return result ? decodeURIComponent(result[2]):null;

	},
	//渲染html模板(hogan渲染)
	renderHtml:function(htmlTemplate,data){
		var template = Hogan.compile(htmlTemplate);
		var result = template.render(data);
		return result;
	},
	//成功提示方法
	successTips:function(msg){
		alert(msg || '操作成功！');
	},
	//失败提示方法
	errorTips:function(msg){
		alert(msg || '操作失败!');
	},
	validate:function(value,type){
		var value = $.trim(value);
		//非空验证
		if('require' === type){
			return !!value;
		}
		//电话验证
		if('phone' === type){
			return /^1\d{10}$/.test(value);
		}
		//邮箱验证
		if('email' === type){
			return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
		}

	},
	//强行登陆方法
	doLogin:function(){
		window.location.href = './login.html?redirect='+encodeURIComponent(window.location.href);
	},
	//回到首页
	goHome:function(){
		window.location.href = './index.html';
	},
	//格式化日期
    formatdate(date){
        //重写date方法
        Date.prototype.format = function(format) { 
            /* 
            * 使用例子:format="yyyy-MM-dd hh:mm:ss"; 
            */ 
            var o = { 
                "M+" : this.getMonth() + 1, // month 
                "d+" : this.getDate(), // day 
                "h+" : this.getHours(), // hour 
                "m+" : this.getMinutes(), // minute 
                "s+" : this.getSeconds(), // second 
                "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter 
                "S" : this.getMilliseconds() 
            } 

            if (/(y+)/.test(format)) { 
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
            } 

            for (var k in o) { 
                if (new RegExp("(" + k + ")").test(format)) { 
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); 
                } 
            } 
            return format; 
        }
        if(date !=null){
            return new Date(date).format("yyyy-MM-dd hh:mm:ss");
        }
        return null;
    }

}

window.mm = _mm;
