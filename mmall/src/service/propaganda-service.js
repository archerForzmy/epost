var _mm = require('util/mm.js');

var _propaganda   = {
	//获取轮播图数据
	getBanner: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUri('/propaganda/list.do'),
            success: resolve,
            error  : reject
        });
    },
};
module.exports = _propaganda;