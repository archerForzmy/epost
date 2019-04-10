var data ={
	shipperId:0
}

$(function(){
	//加载评论列表
	_address.getAddressList(function (res) {
        var addressListHtml = template('addressTamplate',{list:res.list});
        $('#addressList').html(addressListHtml);

        //删除选中的收货地址
    	$('.mui-table-view-cell').on('click', function(e) {
    		//记录下选中的id
    		var id =  $(this).data('index');
    		console.log(id);
    		data.shipperId = id;
    	});

    }, function (errMsg) {
        mui.toast('地址加载失败，请刷新');
    });


    //删除选中的地址
    $('#deleteAddr').on('click', function(event) {
    	if(data.shipperId<=0){
    		mui.toast("请选择要删除的地址");
    		return ;
    	}
    	//删除地址
    	_address.deleteAddress(data.shipperId,function(res){
    		window.location.reload();
    	},function(err){
    		mui.toast("删除地址失败");
    	})
    });

});

var _address   = {
    // 获取地址列表
    getAddressList: function (resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/list.do'),
            data   : {
                pageSize: 50
            },
            success: resolve,
            error  : reject
        });
    },
    // 新建地址
    save: function (addressInfo, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/add.do'),
            data   : addressInfo,
            success: resolve,
            error  : reject
        });
    },
    // 更新地址
    update: function (addressInfo, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/update.do'),
            data   : addressInfo,
            success: resolve,
            error  : reject
        });
    },
    // 获取单条收件人信息(要更新)
    getAddress: function (shippingId, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/select.do'),
            data   : {
                shippingId: shippingId
            },
            success: resolve,
            error  : reject
        });
    },
    // 删除收件人
    deleteAddress : function (shippingId, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/del.do'),
            data   : {
                shippingId: shippingId
            },
            success: resolve,
            error  : reject
        });
    },
};