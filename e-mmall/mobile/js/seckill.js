var data ={
	seckillId:window.mm.getUrlParam("seckillId"),
	start:0,
	end:0,
	now:0
}

$(function(){

		//加载秒杀详情数据
		getSeckillDetail(data.seckillId,function(res){
			res.subImages = res.subImages.split(',');
			//删除加载图标
			$(".loading").remove();
			//渲染页面
			$('.mui-scroll').html(template('evaluateList',{
				seckill:res
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
			//初始化倒计时插件
			data.start = res.start;
			data.end = res.end;
			data.now = res.now;
			countdown();
			//加载完数绑定事件
			//点击秒杀
			$('.btn_addCart').on('tap', function(event) {
				if(data.now<data.start){
					mui.toast("秒杀未开始");
					return false;
				}else if(data.now>=data.end){
					mui.toast("秒杀结束了");
					return false;
				}
				var num = mui('.mui-numbox').numbox().getValue();
				if(num<=0){
					mui.toast('至少选择一件商品');
					return false;
				}
				seckillEx({
					seckillId:data.seckillId,
					token:res.token,
					count:num
				},function(err){
                    mui.toast(err);
                });
			});
		},function(err){

		});



});

var seckillEx = function(seckillInfo,callback){
	seckill(seckillInfo, function(res){
       //跳转秒杀订单页面
       window.location.href = './orderSeckill.html?seckillId='+res.id;
    }, function(errMsg){
        callback(errMsg);
    });
} 
// 获取秒杀详细信息
var getSeckillDetail = function(seckillId, resolve, reject){
        window.mm.request({
            url     : _mm.getServerUri('/seckill/detail.do'),
            data    : {
                seckillId : seckillId
            },
            success : resolve,
            error   : reject
        });
}
//秒杀方法
var seckill = function(seckillInfo,resolve, reject){
         window.mm.request({
            url     : _mm.getServerUri('/seckill/seckill.do'),
            data    : seckillInfo,
            success : resolve,
            error   : reject
        });
}

//秒杀倒计时方法
var countdown = function(){
        //显示倒计时
        var start = data.start;
        var now = data.now;
        var end = data.end;
        if(now < start){
            $('.s-info-plane .s-label').html('<i class="fa fa-bolt"></i> 秒杀未开始');
            $('.seckill-add').hide();
            var num = (start-now) + new Date().getTime();
            $('.s-info-plane .s-info').countdown(num,function(event){
                //时间格式
                var format = event.strftime('<span class="s-date day">%D天</span> <span class="s-date hour">%H时</span> <span class="s-date minute">%M分</span> <span class="s-date second">%S秒</span>');
                $('.s-info-plane .s-info').html(format);
                /*时间完成后回调事件*/
            }).on('finish.countdown',function(){
                num =(end-start) + new Date().getTime();
                $('.seckill-add').show();
                $('.s-info-plane .s-label').html('<i class="fa fa-bolt"></i> 活动进行中');
                //活动倒计时
                $('.s-info-plane .s-info').countdown(num,function(event){
                    //时间格式
                    var format = event.strftime('<span class="s-date day">%D天</span> <span class="s-date hour">%H时</span> <span class="s-date minute">%M分</span> <span class="s-date second">%S秒</span>');
                    $('.s-info-plane .s-info').html(format);
                    /*时间完成后回调事件*/
                }).on('finish.countdown',function(){
                    $('.s-info-plane .s-label').html('<i class="fa fa-bolt"></i> 秒杀结束');
                    $('.s-info-plane .s-info').html('<span class="s-date day">--</span> <span class="s-date hour">--</span> <span class="s-date minute">--</span> <span class="s-date second">--</span>');
                    $('.seckill-add').hide();
                });
            });
        }else if(now > start && now < end){
            var num = (end-now) + new Date().getTime();
            //活动正在进行
            $('.s-info-plane .s-label').html('<i class="fa fa-bolt"></i> 活动进行中');
            $('.seckill-add').show();
            //活动倒计时
            $('.s-info-plane .s-info').countdown(num,function(event){
            	//更新当前时间
            	data.now =  event.timeStamp;
                //时间格式
                var format = event.strftime('<span class="s-date day">%D天</span> <span class="s-date hour">%H时</span> <span class="s-date minute">%M分</span> <span class="s-date second">%S秒</span>');
                $('.s-info-plane .s-info').html(format);
                /*时间完成后回调事件*/
            }).on('finish.countdown',function(){
            	data.now =  data.end;
                $('.s-info-plane .s-label').html('<i class="fa fa-bolt"></i> 秒杀结束');
                $('.s-info-plane .s-info').html('<span class="s-date day">--</span> <span class="s-date hour">--</span> <span class="s-date minute">--</span> <span class="s-date second">--</span>');
                $('.seckill-add').hide();
            });
        }else if(now > end){
            //活动结束
            $('.s-info-plane .s-info').html('<span class="s-date day">--</span> <span class="s-date hour">--</span> <span class="s-date minute">--</span> <span class="s-date second">--</span>');
            $('.s-info-plane .s-label').html('<i class="fa fa-bolt"></i> 秒杀结束');
            $('.seckill-add').hide();
        }    
}