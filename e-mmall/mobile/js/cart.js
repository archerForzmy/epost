 $(function(){
 	/*1.1 完成下拉刷新效果*/
    mui.init({
        /*拉动刷新组件*/
        pullRefresh:{
            /*目标容器*/
            container:".mui-scroll-wrapper",
            /*下拉*/
            down:{
                /*默认下拉一次*/
                auto:true,
                /*下拉操作后的回调函数*/
                callback:function(){
                    /*指向当前下拉组件*/
                    var that = this;
                    /*1.2 完成数据获取*/
                    getCartList(function(res){
                        /*1.3 展示商品*/
                        $('.mui-table-view').html(template('cart',{data:res}));
                        $('.mui-table-cell').width($('.mui-slider-handle').width());
                        $('.total').html(res.cartTotalPrice);
                        /*1.4 清除加载效果*/
                        that.endPulldownToRefresh();
                    },function(err){

                    })
                }
            }
        }
    });

    /*2.总额计算*/
    $('.mui-table-view').on('change','input',function(){
        /*设置 计算  价格*/
        var $this = $(this),
                productId = $this.attr('data-id');
        // 选中
        if($this.is(':checked')){
            selectProduct(productId, function(res){
                //返回选中的购物车数目/没有选中的购物车数目
                $('.mui-table-view').html(template('cart',{data:res}));
                $('.mui-table-cell').width($('.mui-slider-handle').width());
                $('.total').html(res.cartTotalPrice);
            }, function(errMsg){
                 
            });
        }
        // 取消选中
        else{
            unSelectProduct(productId, function(res){
                $('.mui-table-view').html(template('cart',{data:res}));
                $('.mui-table-cell').width($('.mui-slider-handle').width());
                $('.total').html(res.cartTotalPrice);
            }, function(errMsg){
                    
            });
        }
    });

    /*3.删除操作*/
    $('.mui-table-view').on('tap','.mui-btn-red',function(){
        var id = $(this).attr('data-id');
        /*2.1 弹出提示框*/
        mui.confirm('您是否确定删除？', '温馨提示', ['确定','取消'], function(e) {
            if (e.index == 0) {
                /*2.2 确定之后 发送请求*/
                deleteProduct(id, function(res){
                    mui.toast('操作成功');
                    $('.mui-table-view').html(template('cart',{data:res}));
                    $('.mui-table-cell').width($('.mui-slider-handle').width());
                    $('.total').html(res.cartTotalPrice);
                },function (errMsg) {
            
                });
            }
        });
    });

    /*3.编辑操作*/
    $('.mui-table-view').on('tap','.mui-btn-blue',function(){
        var data = this.dataset;
        mui.confirm(template('edit',data).replace(/\n/g,''), '编辑商品', ['确定','取消'], function(e) {
            if (e.index == 0) {
                /*2.2 确定之后 发送请求*/
                updateProduct({
                    productId   :data.id,
                    count       :$('.mui-numbox input').val()
                }, function(res){
                    mui.toast('操作成功');
                    $('.mui-table-view').html(template('cart',{data:res}));
                    $('.mui-table-cell').width($('.mui-slider-handle').width());
                    $('.total').html(res.cartTotalPrice);
                }, function(errMsg){
                         
                });
            }
        });
        mui('.mui-numbox').numbox();
        $('.lt_cart_edit').on('tap','span',function(){
            $('.lt_cart_edit span').removeClass('now');
            $(this).addClass('now');
        });
    });
 
 });
 //加载购物车数据
var getCartList = function(resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/cart/list.do'),
            success : resolve,
            error   : reject
        });
}

var updateProduct = function(productInfo, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/cart/update.do'),
            data    : productInfo,
            success : resolve,
            error   : reject
        });
}

// 选择购物车商品
var selectProduct = function(productId, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/cart/select.do'),
            data    :{
                productId:productId
            },
            success : resolve,
            error   : reject
        });
}
// 取消选择购物车商品
var unSelectProduct = function(productId, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/cart/un_select.do'),
            data    :{
                productId:productId
            },
            success : resolve,
            error   : reject
        });
}

var deleteProduct = function(productIds, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/cart/delete_product.do'),
            data    : {
                productIds:productIds
            },
            success : resolve,
            error   : reject
        });
}
