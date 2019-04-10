require("./index.css");
require("page/common/nav/index.js");
require("page/common/header/index.js");
require("util/slider/index.js");
var _mm = require('util/mm.js');

var _propaganda = require('service/propaganda-service.js');
var _seckill = require('service/seckill-service.js');
var templateBanner = require('./banner.string');
var templateKeywords = require('./keywords.string');
var templateSeckill = require('./seckill.string');

var page = {
	data:{
		seckill:{
			size:0,
			current:0,
            start:0,   //秒杀活动开始时间
            now:0,      //系统当前时间
            end:0,       //活动结束
            list:[]
		}
	},
	init:function(){
		this.onLoad();
	},
	onLoad:function(){
        var that = this;
		//渲染关键字列表
		var keywordsHtml = _mm.renderHtml(templateKeywords);
		$('.keywords-con').html(keywordsHtml);
		//加载轮播图
        this.loadBanner();
        //加载秒杀列表
        this.loadSeckill();
	},
    //加载秒杀列表
    loadSeckill(){
        var that = this;
        _seckill.getCurrentSeckillList(function(res){
            //缓存数据
            that.data.seckill.list = res;
            if(res.length>0){
                that.data.seckill.size = res.length;
                that.data.seckill.current = 0;
                that.data.seckill.start=res[0].start;
                that.data.seckill.end=res[0].end;
                that.data.seckill.now=res[0].now;
                //显示倒计时
                that.countdown();
                //渲染秒杀面板
                var seckillHtml = _mm.renderHtml(templateSeckill,{
                    list:res
                });
                $('.seckill-con').html(seckillHtml);
                //加载事件
                that.bindSeckillEvent();
            }else{
                $('.seckill-con').hide();
                $('.seckill-header').hide();
            }
        },function(err){
            _mm.errorTips("加载秒杀列表失败");
        });
    },
    //加载轮播
    loadBanner(){
        var that = this;
        // 渲染banner的html（轮播图）
        _propaganda.getBanner(function(res){
            var bannerHtml = _mm.renderHtml(templateBanner,{
                banners:res
            });
            $('.banner-con').html(bannerHtml);
            // 初始化轮播图
            // 初始化banner   （显示轮播下面的原点指示器）
            var $slider = $('.banner').unslider({
                dots: true
            });
            that.slider = $slider;
            //加载事件
            that.bindBannerEvent();
        },function(err){
            _mm.errorTips("加载轮播广告失败");
        });     
    },
    //绑定轮播事件
	bindBannerEvent:function(){
		var that = this;
		// 前一张和后一张操作的事件绑定
    	$('.banner-con .banner-arrow').click(function(){
    		//判断是点上一张还是下一张
        	var forward = $(this).hasClass('prev') ? 'prev' : 'next';
        	//切换图片
        	that.slider.data('unslider')[forward]();
    	});
	},
    //绑定秒杀面板事件
    bindSeckillEvent(){
        var that = this;
        //上一页和下一页
        $('.seckill-con .seckill-arrow').click(function(){
            //判断是点上一张还是下一张
            var forward = $(this).hasClass('prev') ? 'prev' : 'next';
            //切换图片
            if(forward === 'prev'){
                if(that.data.seckill.current>0){
                    console.log('prev');
                    $('.seckill-con .seckill-item:eq('+(that.data.seckill.current+4)+')').hide(50);
                    that.data.seckill.current--;
                    $('.seckill-con .seckill-item:eq('+that.data.seckill.current+')').show(50);
                }
            }else{
                if(that.data.seckill.current<that.data.seckill.size-4){
                    console.log('next');
                    $('.seckill-con .seckill-item:eq('+that.data.seckill.current+')').hide(50);
                    that.data.seckill.current++;
                    $('.seckill-con .seckill-item:eq('+(that.data.seckill.current+4)+')').show(50);
                }
            }
        });
    },
    //显示倒计时
    countdown : function(){
        //显示倒计时
        var _this = this;
        var start = new Date(_this.data.seckill.start).getTime();
        var now = new Date(_this.data.seckill.now).getTime();
        var end = new Date(_this.data.seckill.end).getTime();
        if(now < start){
            $('.seckill-header .seckill-desc').html("活动未开始");
            var num = (start-now) + new Date().getTime();
            //活动没有开始
            $('.seckill-header .seckill-date').countdown(num,function(event){
                //时间格式
                var format = event.strftime('<span class="day">%D天</span> <span class="hour">%H时</span> <span class="minute">%M分</span> <span class="second">%S秒</span>');
                $(this).html(format);
                /*时间完成后回调事件*/
            }).on('finish.countdown',function(){
                $(this).html('<span class="day">--</span> <span class="hour">--</span> <span class="minute">--</span> <span class="second">--</span>');
                $('.seckill-header .seckill-desc').html("活动正在进行");
            });
        }else if(now > start && now < end){
            //活动正在进行
            $('.seckill-header .seckill-date').html('<span class="day">--</span> <span class="hour">--</span> <span class="minute">--</span> <span class="second">--</span>');
            $('.seckill-header .seckill-desc').html("活动正在进行");
        }else if(now > end){
            //活动结束
            $('.seckill-header .seckill-date').html('<span class="day">--</span> <span class="hour">--</span> <span class="minute">--</span> <span class="second">--</span>');
            $('.seckill-header .seckill-desc').html("今日活动结束");
        }    
    }
}

$(function () {
	page.init();
});


