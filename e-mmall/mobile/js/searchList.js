var listParam = {
    keyword         : window.mm.getUrlParam('key')        || '',
    categoryId      : window.mm.getUrlParam('categoryId') || '',
    orderBy         : window.mm.getUrlParam('orderBy')    || 'default',
    pageNum         : window.mm.getUrlParam('pageNum')    || 1,
    pageSize        : window.mm.getUrlParam('pageSize')   || 6
}

$(function(){ 
	//出事化区域滚动插件
	mui('.mui-scroll-wrapper').scroll({
		indicators: false,
		bounce: true
	});

	//1、页面初始化的时候关键字在搜索框中显示
	var params =  ct.getKeysByUrl();
	var $input = $('input').val(listParam.keyword || '');
	//2、页面初始化的时候默认加载一页数据（4条）
	getProductList(listParam,function(res){
		$(".ct_produces").html(template('list',{data:res.list}));
	},function(err){

	});

	//3、用户点击搜索的时候，根据关键字进行搜索但是要重置排序
	$('.ct_search a').on('tap',function(){
		var key = $input.val();
		//判断关键字是否为空
		if(!key){
			//mui消息提示
			mui.toast("请输入搜索关键字");
			return false;
		}
		//排序功能重置
		$('.ct_order a').removeClass('now').find('span').addClass('fa-angle-down').removeClass('fa-angle-up');
		//重新加载
		listParam.keyword = key;
		getProductList(listParam,function(res){
			$(".ct_produces").html(template('list',{data:res.list}));
		},function(err){

		})
	});
	//4、用户点击排序列表要根据排序选项进行排序（1升序，2降序）
	$('.ct_order a').on('tap',function(){

		var $this = $(this);
		if(!$this.hasClass('now')){
			$this.addClass('now').siblings().removeClass('now').find('span').addClass('fa-angle-up').removeClass('fa-angle-down');
		}else{
			if($this.find('span').hasClass('fa-angle-down')){
				$this.find('span').addClass('fa-angle-up').removeClass('fa-angle-down')
			}else{
				$this.find('span').addClass('fa-angle-down').removeClass('fa-angle-up')
			}
		}
		//获取排序条件
		var order = $this.attr('data-order');
		var orderVal = $this.find('span').hasClass('fa-angle-up')?'desc':'asc';

		if(order!=='default'){
			order = order+"_"+orderVal;
		}

		var key = $input.val();
		//判断关键字是否为空
		if(!key){
			//mui消息提示
			mui.toast("请输入搜索关键字");
			return false;
		}
		listParam['orderBy'] = order;
		listParam['keyword'] = key;
		//重新加载
		getProductList(listParam,function(res){
			$(".ct_produces").html(template('list',{data:res.list}));
		},function(err){

		});

	});
	//5、下拉时当前搜索内容进行页面刷新，重置上拉加载的数据
	mui.init({
  		pullRefresh : {
    		container:"#pullrefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    		down : {
      			auto: false,//可选,默认false.首次加载自动上拉刷新一次
      			callback :function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      				var that = this;
      				var key = $input.val();
					//判断关键字是否为空
					if(!key){
						//mui消息提示
						mui.toast("请输入搜索关键字");
						return false;
					}
					//重置搜索条件
					listParam = {
    						keyword         : '',
    						categoryId      : '',
    						orderBy         : 'default',
    						pageNum         : 1,
    						pageSize        : 6
					};

					//排序功能重置
					$('.ct_order a').removeClass('now').find('span').addClass('fa-angle-down').removeClass('fa-angle-up');
					//渲染数据
					getProductList(listParam,function(res){
						$(".ct_produces").html(template('list',{data:res.list}));	
					},function(err){

					});
					//三秒后执行函数
					setTimeout(function() { 
						that.endPulldownToRefresh();
						//重置上拉加载
						that.refresh(true);
					}, 1000);
      			} 
    		},
    		up:{
    			callback:function(){
    				listParam.pageNum++;
    				var that = this;
      				var key = $input.val();
					//判断关键字是否为空
					if(!key){
						//mui消息提示
						mui.toast("请输入搜索关键字");
						return false;
					}

					var order = $('ct_order a.now').attr('data-order');
					var orderVal = $('ct_order a.now').find('span').hasClass('fa-angle-up')?2:1;
					if(order!=='default'){
						order = order+"_"+orderVal;
					}
					listParam['orderBy'] = order;
					listParam['keyword'] = key;
					//渲染数据
					getProductList(listParam,function(res){
						setTimeout(function(){
							$(".ct_produces").append(template('list',{data:res.list}));
							//停止上拉加载
							if(res.list.length){
								that.endPullupToRefresh();
							}else{
								that.endPullupToRefresh(false);//没有数据了
							}
						},1000);
					},function(err){

					});
    			}
    		}
  		}
	});
	//6、用户下拉加载下一页数据（没有数据就显示没有更多数据）

});

var getProductList = function(listParam, resolve, reject){
        window.mm.request({
            url     : window.mm.getServerUri('/product/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
}

