$(function(){ 

	loadHistroy();

	//点击搜素跳转到商品列表页面
	$(".ct_search a").on("tap",function(){
		//获取搜索关键字
		var key = $.trim($('input').val());
		//将搜索关键字添加到本地存储中
		var values = JSON.parse(localStorage.getItem("key"));
		if(values==null||values==''){
			values = [];
		}
		if(key!==''){
			var a = values.indexOf(key);
			if(a<0 && values.length<5){
				values.push(key);
			}else if(a<0 && values.length>=5){
				values.splice(0, 1);
				values.push(key); 
			}
		}
		//更新到本地
		localStorage.setItem("key",JSON.stringify(values));
		//加载搜索记录
		loadHistroy();
		//判断关键字是否为空
		if(!key){
			//mui消息提示
			mui.toast("请输入搜索关键字");
			return false;
		}
		location.href = 'searchList.html?key='+key;

	});

	$('#deleteKey').on('tap', function(event) {
		mui.toast("清除搜索历史");
		//删除key
		localStorage.clear();
		//加载搜索记录
		loadHistroy();
	});

	//删除单项历史记录
	$('.close').on('tap', function(event) {
		var history =  event.target.dataset.history;
		var values = JSON.parse(localStorage.getItem("key"));
		var index = values.indexOf(history);
		values.splice(index,1);
		localStorage.setItem("key",JSON.stringify(values));
		loadHistroy();
	});
});

var loadHistroy = function(){
	//加载历史记录
	var values = JSON.parse(localStorage.getItem("key"));
	if(values==null||values==''){
		values = [];
	}
	$('.ct_history_list').html(template('history',{list:values}));
}