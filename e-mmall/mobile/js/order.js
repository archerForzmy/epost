var data = {
    listParam:{
        pageSize:5,
        pageNum:1
    },
    list:[]
}

$(function(){
    //出事化区域滚动插件
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        bounce: true
    });

    //加载订单列表
    loadOrder();


    mui.init({
        /*拉动刷新组件*/
        pullRefresh:{
            /*目标容器*/
            container:".mui-scroll-wrapper",
            /*上拉*/
            up:{
                /*默认上拉一次*/
                auto:false,
                height:50,
                contentrefresh : "正在加载...",
                contentnomore:'没有更多数据了',
                /*下拉操作后的回调函数*/
                callback:function(){
                    /*指向当前下拉组件*/
                    var that = this;
                    getOrderList({
                         pageSize:5,
                         pageNum:data.listParam.pageNum+1
                    }, function (res) {               
                        if(res.list.length>0){
                            data.listParam.pageNum++;
                            var dataLength = data.list.length;
                            for(var i=dataLength;i<(res.list.length+dataLength);i++){
                                data.list[i] = res.list[i-dataLength];
                            }
                            $('.mui-scroll').html(template('orderList',{list:data.list}));
                            $(".order_detail").on('tap', function(event) {
                                var orderNo = event.target.dataset.id;
                                window.location.href = './orderDetail.html?orderNo='+orderNo;
                            });
                            $(".order_pay").on('tap', function(event) {
                                var orderNo = event.target.dataset.id;
                                window.location.href = './payment.html?orderNumber='+orderNo;
                            });
                        }else{
                            return;
                        }
                        that.endPullupToRefresh();
                    }, function (errMsg) {
                        mui.toast('加载失败');
                    });
                }
            }
        }
    });
});

var loadOrder = function(){
    getOrderList(data.listParam, function (res) {
        console.log(res.list);
        data.list = res.list;
        $('.mui-scroll').html(template('orderList',{list:data.list}));
        $(".order_detail").on('tap', function(event) {
            var orderNo = event.target.dataset.id;
            window.location.href = './orderDetail.html?orderNo='+orderNo;
        });
        $(".order_pay").on('tap', function(event) {
            var orderNo = event.target.dataset.id;
            window.location.href = './payment.html?orderNumber='+orderNo;
        });
    }, function (errMsg) {
        mui.toast('加载失败');
    });
}

var getOrderList = function(listParam, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/order/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
}
