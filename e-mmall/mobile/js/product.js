var data = {};

$(function(){
	//0、加载商品信息
	getProductData(ct.getKeysByUrl().productId,function(res){
		res.subImages = res.subImages.split(',');
		//删除加载图标
		$(".loading").remove();

		//渲染页面
		$('.mui-scroll').html(template('evaluateList',{
			product:res
		}));
		$(".p_tab_group").html(res.detail);
		//console.log(res.detail);
		//出事化区域滚动插件
		mui('.mui-scroll-wrapper').scroll({
			indicators: false,
			bounce: true
		});
		//初始化轮播组件
		mui('.mui-slider').slider({
  			interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
		});
		//初始化数字输入框
		mui('.mui-numbox').numbox();

		//加载详情数据
		$("#item1mobile").on("click",function(e){
			$(".p_tab_group").html(res.detail);
		})

		//加载评论数据
		$("#item2mobile").on("click",function(e){
			getProductComments({
				productId:ct.getKeysByUrl().productId,
            	pageNum:0,
            	pageSize:5  
			},function(res){
				for(var i=0;i<res.list.length;i++){
					res.list[i].createTime = window.mm.formatdate(res.list[i].createTime);
				}
				data = res; 
				$(".p_tab_group").html(template('commentList',{
					comments:res
				}));
			},function(err){

			})
		})

		$('.btn_addCart').on('tap',function(){
			/*数据校验*/
			var num = mui('.mui-numbox').numbox().getValue();
			if(num<=0){
				mui.toast('至少选择一件商品');
				return false;
			}
			//加入购物车
			addToCart({
				productId   : ct.getKeysByUrl().productId,
                count       : num
			},function(res){
				//弹出添加购物车成功
				mui.confirm('添加成功，去购物车看看！','提示',['是','否'],function(e){
					if(e.index==0){
						//跳转到购物车
						window.location.href =  'cart.html';
					}
				});
			},function(err){

			})

		});


		//评论商品页面跳转
		$('#edit_product').on('click', function(event) {
			window.location.href = 'comment.html?productId='+ct.getKeysByUrl().productId;
		});
	},function(err){
		mui.toast(err);
		//删除加载图标
		$(".loading").remove();
	});

	//绑定上页下页事件
	$(".mui-btn").on('click', function(e) {
		var pageParam = {
				productId:ct.getKeysByUrl().productId,
            	pageNum:data.pageNum,
            	pageSize:data.pageSize  
		}
		if($(this).hasClass('pre')){
			pageParam.pageNum = pageParam.pageNum-1;
		}else{
			pageParam.pageNum = pageParam.pageNum+1;
		}
		//实现上页下页
		getProductComments(pageParam,function(res){
			for(var i=0;i<res.list.length;i++){
				res.list[i].createTime = window.mm.formatdate(res.list[i].createTime);
			}
			data = res; 
			$(".p_tab_group").html(template('commentList',{
				comments:res
			}));
		},function(err){

		})
	});

});

var getProductData = function(productId,resolve, reject){
	window.mm.request({
        url    : window.mm.getServerUri('/product/detail.do'),
        data   : {
			productId:productId
        },
        success: resolve,
        error  : reject
    });
}

//加载商品所有评论
 var getProductComments = function(data, resolve, reject){
    window.mm.request({
        url     : window.mm.getServerUri('/product/comments.do'),
        data    : data,
        success : resolve,
        error   : reject
    });
}
//插入评价
var insertComments = function(comments, resolve, reject){
    window.mm.request({
        url     : window.mm.getServerUri('/product/comment.do'),
        data    : comments,
        success : resolve,
        error   : reject
   	});
}

//加入购物车
var addToCart = function (productInfo,resolve,reject) {
    window.mm.request({
        url: window.mm.getServerUri('/cart/add.do'),
        data:productInfo,
        success:resolve,
        error:reject
    });
}