var data = {
	categorys:[],
};

$(function(){ 
		var height = window.screen.height;
		var ul_height = height-128;
		//设置商品列表高度
		$(".cate_right ul").height(ul_height);

		//初始化一级菜单
		getCategory(function(res){
			data.categorys = res;
			$(".cate_left ul").html(template("fristTamplate",{list:res}));
			//绑定菜单事件
			categoryEvent(res[0].categoryNodeVoList);
			//给一级菜单绑定事件
			$(".cate_left li").on('tap',function(e){
				//没有数据就不要去加载
				if($(this).hasClass('now')) return false;
				//更换样式
				$(".cate_left li").removeClass("now");
				$(this).addClass("now");
				//点击加载数据
				var category = $(this).find("a").attr("data-id");
				var categoryNodeVoList = [];
				//渲染二级菜单
				for(var i=0;i<res.length;i++){
					if(category==res[i].id){
						categoryNodeVoList = res[i].categoryNodeVoList;
					}
				}
				//绑定菜单事件
				categoryEvent(categoryNodeVoList);
			});
		},function(err){

		});

});

var getCategory = function(resolve, reject){
	window.mm.request({
        url    : window.mm.getServerUri('/category/list.do'),
        success: resolve,
        error  : reject
    });
	
}
var getCategoryProduct = function(params,resolve, reject){
	//模拟ajax获取的数据
	window.mm.request({
        url    : window.mm.getServerUri('/product/list.do'),
        success: resolve,
        data   : params,
        error  : reject
    });
}

//绑定二级菜单的事件
var categoryEvent = function(categoryNodeVoList){
	//加载二级菜单
	$("#cate_sub").html(template("secondaryTamplate",{list:categoryNodeVoList}));
	//绑定二级菜单事件
	$("#cate_sub a").on('tap',function(e){
		var categoryId = $(this).attr("data-id");
		//加载商品数据
		getCategoryProduct({
            keyword         : '',
            categoryId      : categoryId,
            orderBy         : 'default',
            pageNum         : 1,
            pageSize        : 30
        },function(res){
        	$(".cate_right ul").html(template("productTamplate",{products:res.list}));	
        },function(err){

        });
	});
	$("#cate_sub a:eq(0)").click();
}
