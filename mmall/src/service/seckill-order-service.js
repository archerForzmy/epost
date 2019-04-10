var _mm = require('util/mm.js');

var _seckillOrder = {
	// 获取商品列表
    getSeckillList : function(seckillId,resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/seckillOrder/detail.do'),
            data    : {
                seckillId:seckillId
            },
            success : resolve,
            error   : reject
        });
    },
    // 提交订单（确认）
    createOrder : function(orderInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/seckillOrder/create.do'),
            data    : orderInfo,
            success : resolve,
            error   : reject
        });
    },
};
module.exports = _seckillOrder;