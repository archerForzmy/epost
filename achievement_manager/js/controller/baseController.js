app.controller('baseController',function($scope){
	//创建分页变量
	$scope.pageinationConf = {
			currentPage:1,   					//当前页码
			totalItems:10,						//总记录数
			itemsPerPage:10,					//一页的总记录数
			perPageOptions:[10,20,30,40,50],	//每一页记录数的修改选项
			onChange:function(){				//改变页面触发的函数
				$scope.reloadList();
			}
	};

	$scope.reloadList = function(){
		$scope.search($scope.pageinationConf.currentPage,$scope.pageinationConf.itemsPerPage);
	};

	//创建一个数组记录下被选中的条目的id
	$scope.selectIds = [];
	//用户勾选删除的条目和复选框绑定在一起的
	$scope.updateSelection = function($event,id){
		if($event.target.checked){
			$scope.selectIds.push(id);  //添加这个元素
		}else{
			var index = $scope.selectIds.indexOf(id);
			//删除这个元素
			$scope.selectIds.splice(index,1);
		}

	};

	//根据集合对象的属性名称和属性之查询这个对象
	$scope.sreachObjectByKey = function(list,key,value){
		for(var i=0;i<list.length;i++){
			if(list[i][key]==value){
				return list[i];
			}
		}

		return null;
	}

});