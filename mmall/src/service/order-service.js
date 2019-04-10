var _mm = require('util/mm.js');

var _order = {
	// 获取商品列表（购物车中）
    getProductList : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/order/get_order_cart_product.do'),
            success : resolve,
            error   : reject
        });
    },
    // 提交订单（确认）
    createOrder : function(orderInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/order/create.do'),
            data    : orderInfo,
            success : resolve,
            error   : reject
        });
    },
    // 获取订单列表
    getOrderList : function(listParam, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/order/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
    },
    // 获取订单详情
    getOrderDetail : function(orderNumber, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/order/detail.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
    },
    // 取消订单
    cancelOrder : function(orderNumber, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/order/cancel.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
    }
};

module.exports = _order;