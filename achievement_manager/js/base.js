var app = angular.module('zyg',['pagination']);
//定义过滤器  trustHtml是过滤器名称，$sce是认证服务需要先引入认证服务才可以直接传参
app.filter("trustHtml", ['$sce',function($sce) {
	return function(data){ //表示要过滤的内容
		return $sce.trustAsHtml(data);
	}
}]);