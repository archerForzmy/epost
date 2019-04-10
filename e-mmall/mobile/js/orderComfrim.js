var data ={
	shipperId:0
}
$(function(){
    //出事化区域滚动插件
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        bounce: true
    });

    getAddressList(function (res) {
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
    getProductList(function(res){
    	var productListHtml = template('productTamplate',{order:res});
        $('#productList').html(productListHtml);
        $('.total').html("￥"+res.productTotalPrice);
    },function(err){

    });

    //提交订单事件
    $('.order-submit').on('tap', function(event) {
    	if(data.shipperId==0){
    		mui.toast('请选择收货地址');
    	}else{
    		createOrder({
                shippingId: data.shipperId
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

var getProductList = function(resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/order/get_order_cart_product.do'),
            success : resolve,
            error   : reject
        });
}
var createOrder = function(orderInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/order/create.do'),
            data    : orderInfo,
            success : resolve,
            error   : reject
        });
}