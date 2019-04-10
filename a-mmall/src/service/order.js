import MMUtil from 'util/mm.js';

const _mm = new MMUtil();

export default class Order{

	//获取商品列表(分页加载,要区分是否带关键字)
    getOrderList(listParam){

    	let url ='',
    		data = {};
    	if(listParam.listType==='list'){
    		url = '/manage/order/list.do';
    		data.pageNum = listParam.pageNum;
    	}else if(listParam.listType==='search'){
    		url = '/manage/order/search.do';
    		data.pageNum = listParam.pageNum;
    		data.orderNo = listParam.orderNumber;
    	}
        return _mm.request({
            url     : _mm.getServerUrl(url),
            method  : 'POST',
            data 	:data
        });
    }
    
    //获取订单详细信息
    getOrder(orderNumber){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/order/detail.do'),
            method  : 'POST',
            data    :{
                orderNo:orderNumber
            }
        });
    }

    //订单发货
    sendGood(orderInfo){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/order/send_goods.do'),
            method  : 'POST',
            data    :orderInfo
        });
    }

    //退款
    refund(orderNumber){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/order/refund.do'),
            method  : 'POST',
            data    :{
                orderNo:orderNumber
            }
        });
    }
}