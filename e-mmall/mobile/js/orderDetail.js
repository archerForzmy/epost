$(function(){
	//出事化区域滚动插件
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        bounce: true
    });
	//加载订单详情
	getOrderDetail(ct.getKeysByUrl().orderNo,function(res){
		console.log(res);
		$('.mui-scroll').html(template('orderDetail',{orderDetail:res}));
	},function(err){

	});

});

var getOrderDetail = function(orderNumber, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/order/detail.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
}