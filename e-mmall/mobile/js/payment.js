var data = {};
$(function(){
	getPaymentInfo(window.mm.getUrlParam('orderNumber'), function (res) {
        data = res;
        //渲染html
        $('.mui-scroll').html(template('payment',{payment:res}));
        //监听订单状态
        listenOrderStatus();  
    }, function (errMsg) {
        mui.toast("获取支付数据失败");
   	});
});


var getPaymentInfo = function(orderNumber, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/order/pay.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
}


var getPaymentStatus = function(orderNumber, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/order/query_order_pay_status.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
}

var listenOrderStatus = function () {
        var _this = this;
        this.paymentTimer = window.setInterval(function () {
            getPaymentStatus(window.mm.getUrlParam('orderNumber'),function (res) {
                //订单已支付
                if(res == true){
                    window.location.href
                        = './orderDetail.html?orderNo=' + window.mm.getUrlParam('orderNumber');
                }
            },function (errMsg) {

            })
        },1000);
}