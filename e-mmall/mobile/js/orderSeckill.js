var data ={
    seckillId:window.mm.getUrlParam("seckillId"),
	shipperId:0
}
$(function(){
    //出事化区域滚动插件
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        bounce: true
    });

    getAddressList(function (res) {
        data.shipperId = res.list[0].id
        var addressListHtml = template('addressTamplate',{list:res.list});
        $('#addressList').html(addressListHtml);

        //删除选中的收货地址
    	$('.mui-table-view-cell').on('click', function(e) {
    		//记录下选中的id
    		var id =  $(this).data('index');
    		data.shipperId = id;
    	});

    }, function (errMsg) {
        mui.toast('地址加载失败，请刷新');
    });

    //加载商品列表
    getSeckillList(data.seckillId,function(res){
    	var productListHtml = template('productTamplate',{order:res});
        $('#productList').html(productListHtml);
        $('.total').html("￥"+res.totalPrice);
    },function(err){
        mui.toast(err);
    });

    //提交订单事件
    $('.order-submit').on('tap', function(event) {
    	if(data.shipperId==0){
    		mui.toast('请选择收货地址');
    	}else{
    		createOrder({
                shippingId: data.shipperId,
                seckillId:data.seckillId
            }, function (res) {
                window.location.href = './payment.html?orderNumber=' + res.orderNo;
            }, function (errMsg) {
                  
            });
    	}
    });
});


// 获取地址列表
var getAddressList= function (resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/list.do'),
            data   : {
                pageSize: 50
            },
            success: resolve,
            error  : reject
        });
}

var getSeckillList = function(seckillId,resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/seckillOrder/detail.do'),
            data    : {
                seckillId:seckillId
            },
            success : resolve,
            error   : reject
        });
    
}
var createOrder = function(orderInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/seckillOrder/create.do'),
            data    : orderInfo,
            success : resolve,
            error   : reject
        });
}