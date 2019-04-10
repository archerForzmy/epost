var _mm = require('util/mm.js');

var _cart = {
    // 获取购物车列表
    getCartList : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/list.do'),
            success : resolve,
            error   : reject
        });
    },
    // 获取购物车数量
    getCartCount:function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/get_cart_product_count.do'),
            success : resolve,
            error   : reject 
        });
    },
    //添加到购物车
    addToCart:function (productInfo,resolve,reject) {
        _mm.request({
            url:_mm.getServerUri('/cart/add.do'),
            data:productInfo,
            success:resolve,
            error:reject
        });
    },
    // 选择购物车商品
    selectProduct : function(productId, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/select.do'),
            data    :{
                productId:productId
            },
            success : resolve,
            error   : reject
        });
    },
    // 取消选择购物车商品
    unSelectProduct : function(productId, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/un_select.do'),
            data    :{
                productId:productId
            },
            success : resolve,
            error   : reject
        });
    },
    // 选中全部商品
    selectAllProduct : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/select_all.do'),
            success : resolve,
            error   : reject
        });
    },
    // 取消选择全部商品
    unSelectAllProduct : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/un_select_all.do'),
            success : resolve,
            error   : reject
        });
    },
    // 更新购物车商品数量
    updateProduct : function(productInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/update.do'),
            data    : productInfo,
            success : resolve,
            error   : reject
        });
    },
    //删除指定商品
    deleteProduct : function(productIds, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/cart/delete_product.do'),
            data    : {
                productIds:productIds
            },
            success : resolve,
            error   : reject
        });
    },
};
module.exports = _cart;