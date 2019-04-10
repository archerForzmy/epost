var _mm = require('util/mm.js');

var _seckill = {
	// 获取秒杀列表
    getCurrentSeckillList : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/seckill/list.do'),
            success : resolve,
            error   : reject
        });
    },
    // 获取秒杀详细信息
    getSeckillDetail : function(seckillId, resolve, reject){
        _mm.request({
            url     : _mm.getServerUri('/seckill/detail.do'),
            data    : {
                seckillId : seckillId
            },
            success : resolve,
            error   : reject
        });
    },
    //秒杀方法
    seckill:function(seckillInfo,resolve, reject){
         _mm.request({
            url     : _mm.getServerUri('/seckill/seckill.do'),
            data    : seckillInfo,
            success : resolve,
            error   : reject
        });
    }
};

module.exports = _seckill;