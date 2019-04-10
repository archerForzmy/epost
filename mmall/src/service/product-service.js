var _mm = require('util/mm.js');

var _product = {
	// 获取商品列表
    getProductList : function(listParam, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/product/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
    },
    // 获取商品详细信息
    getProductDetail : function(productId, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/product/detail.do'),
            data    : {
                productId : productId
            },
            success : resolve,
            error   : reject
        });
    },
    //加载商品所有评论
    getProductComments : function(data, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/product/comments.do'),
            data    : data,
            success : resolve,
            error   : reject
        });
    },
    //插入评价
    insertComments : function(comments, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/product/comment.do'),
            data    : comments,
            success : resolve,
            error   : reject
        });
    },
};

module.exports = _product;