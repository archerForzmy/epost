var data = {
	score:5,
	type:1,
	productId:ct.getKeysByUrl().productId,
	body:''
}

$(function(){
	//出事化区域滚动插件
	mui('.mui-scroll-wrapper').scroll({
		indicators: false,
		bounce: true
	});

	//评价事件
	$('.type').on('click', function(e) {
		data.type =  $(this).data('index');
		$('.type').removeClass('active');
		$(this).addClass('active');
	});

	//评分事件
	$('.comment-star span').on('click', function(e) {
		data.score =  $(this).data('index');
		$('.comment-star span').removeClass('active');
		$(this).prevAll().addClass('active');
		$(this).addClass('active');
	});

	$('.comment-body-content').on('keyup', function(e){
        data.body = $(e.target).val();
    });

	//提交评论
	$('#submit_comment').on('click', function(e) {
		if(data.body.trim().length<=0){
			mui.toast('评论内容能为空');
			return;
		}
		insertComments({
            productId:data.productId,
            score:data.score,
            body:data.body,
            type:data.type,
            createTime:_mm.formatdate(new Date())
        },function(res){
            //跳转到商品页面
            window.location.href = 'product.html?productId='+ct.getKeysByUrl().productId;
        },function(errMsg){
            mui.toast(errMsg);
        });
	});
});


var insertComments = function(comments, resolve, reject){
       	window.mm.request({
            url     : window.mm.getServerUri('/product/comment.do'),
            data    : comments,
            success : resolve,
            error   : reject
        });
}



