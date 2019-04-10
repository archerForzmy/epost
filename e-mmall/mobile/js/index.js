var data ={
		start:0,   //秒杀活动开始时间
        now:0,      //系统当前时间
        end:0, 
};

$(function(){
	//加载秒杀数据

	//出事化区域滚动插件
	mui('.mui-scroll-wrapper').scroll({
		indicators: false,
		bounce: true
	});
	mui('#layer1').scroll({
		scrollY: false, 
 		scrollX: true,
		indicators: false,
		bounce: true
	});
	//加载轮播数据
	getBanner(function(res){
		$('#banners').html(template('bannerList',{banners:res}));
		//初始化轮播组件
		mui('.mui-slider').slider({
  			interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
		});
	},function(err){

	});

	//加载秒杀数据
	getCurrentSeckillList(function(res){
		$('.seckill-content').html(template('seckillList',{list:res}));
		//初始化倒计时
		if(res.length>0){
            data.start=res[0].start;
            data.end=res[0].end;
            data.now=res[0].now;
            //倒计时
            countdown();
        }
		//初始化秒杀横向列表
		mui('.mui-scroll-wrapper').scroll({
			indicators: false,
			bounce: true
		});
		mui('#xitem').scroll({
			scrollY: false, 
 			scrollX: true,
			indicators: false,
			bounce: true
		});
	},function(err){

	});

});

//加载轮播图
function getBanner(resolve, reject){
	window.mm.request({
        url    : window.mm.getServerUri('/propaganda/list.do'),
        success: resolve,
        error  : reject
    });
}

//加载秒杀列表
function getCurrentSeckillList(resolve, reject){
	window.mm.request({
        url    : window.mm.getServerUri('/seckill/list.do'),
        success: resolve,
        error  : reject
    });
}

//初始化倒计时
function countdown(){
        //显示倒计时
        var start = new Date(data.start).getTime();
        var now = new Date(data.now).getTime();
        var end = new Date(data.end).getTime();
        if(now < start){
            $('.seckill-label').html("活动未开始");
            var num = (start-now) + new Date().getTime();
            //活动没有开始
            $('.seckill-date').countdown(num,function(event){
                //时间格式
                var format = event.strftime('<span class="day">%D天</span> <span class="hour">%H时</span> <span class="minute">%M分</span> <span class="second">%S秒</span>');
                $(this).html(format);
                /*时间完成后回调事件*/
            }).on('finish.countdown',function(){
                $(this).html('<span class="day">--</span> <span class="hour">--</span> <span class="minute">--</span> <span class="second">--</span>');
                $('.seckill-label').html("活动正在进行");
            });
        }else if(now > start && now < end){
            //活动正在进行
            $('.seckill-date').html('<span class="day">--</span> <span class="hour">--</span> <span class="minute">--</span> <span class="second">--</span>');
            $('.seckill-label').html("活动正在进行");
        }else if(now > end){
            //活动结束
            $('.seckill-date').html('<span class="day">--</span> <span class="hour">--</span> <span class="minute">--</span> <span class="second">--</span>');
            $('.seckill-label').html("今日活动结束");
        }    
}
