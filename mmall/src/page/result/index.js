require("./index.css");
require("page/common/nav-simple/index.js");
var _mm = require('util/mm.js');

$(function () {
	//获取URL参数的结果类型
    var type  = _mm.getUrlParam('type') || 'default';
    var $element = $('.' + type + '-success');
    //如果是支付结果
    if(type === 'payment'){
        var orderNumber = _mm.getUrlParam('orderNumber'),
            $orderNumber = $element.find('.order-number');
        $orderNumber.attr('href',$orderNumber.attr('href') + orderNumber);
    }
    //显示对应的提示元素
    $element.show();
});