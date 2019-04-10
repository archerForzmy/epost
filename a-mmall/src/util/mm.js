const conf = {
    serverHost: 'http://www.epost.com/epost',
}
class MMUtil{
    // 请求服务器
    request(param){
        return new Promise((resolve, reject) => {
            $.ajax({
                type       : param.method   || 'get',
                url        : param.url      || '',
                dataType   : param.type     || "json",
                data       : param.data     || null,
                xhrFields:{withCredentials:true},
                success    : res => {
                    // 数据成功
                    if(0 === res.status){
                        typeof resolve === 'function' && resolve(res.data || res.msg);
                    }
                    // 没登录状态, 且强制登录, 自动跳转到登录页
                    else if(res.status === 10){
                        this.doLogin();
                    }
                    // 其他状态，调用error
                    else{
                        typeof reject === 'function' && reject(res.msg || res.data);
                    }
                },
                error: err => {
                    typeof reject === 'function' && reject(err.statusText);
                }
            });
        });
    }
    // 获取url参数
    getUrlParam(name){
        //param=123&param1=345
        var reg         = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            queryString = window.location.search.split('?')[1] || '',
            result      = queryString.match(reg);
        //['param=123','','123','&']
        return result ? decodeURIComponent(result[2]) : null;
    }
    // 获取请求url地址
    getServerUrl(path){
        return conf.serverHost + path;
    }
    // alert
    successTips(msg){
        alert(msg || '操作成功');
    }
    // alert
    errorTips(msg){
        alert(msg || '哪里不对了~');
    }
    // 跳转登录
    doLogin(){
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    // 向本地存储里放数据
    setStorage(name, data){
        // array / json
        if(typeof data === 'object'){
            let jsonString = JSON.stringify(data);
            window.localStorage.setItem(name, jsonString);
        }
        // number / string / boolean
        else if(typeof data === 'number' || typeof data === 'string' || typeof data === 'boolean'){
            window.localStorage.setItem(name, jsonString);
        }
        // undefined / function
        else{
            alert('该数据类型不能用于本地存储');
        }
    }
    // 从本地存储获取数据
    getStorage(name){
        let data = window.localStorage.getItem(name);
        if(data){
            // JSON.parse
            return JSON.parse(data);
        }else{
            return '';
        }
    }
    // 删除本地存储
    removeStorage(name){
        window.localStorage.removeItem(name);
    }

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
export default MMUtil;