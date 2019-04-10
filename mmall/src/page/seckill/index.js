require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _seckill = require('service/seckill-service.js');
var templateIndex   = require('./index.string');
 
var page = {
    data: {
        seckillId : _mm.getUrlParam('seckillId') || '',
        start:'2019/3/02 00:00:00',
        now:'2019/3/02 23:59:42',
        end:'2019/3/03 00:00:00'
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        // 如果没有传productId, 自动跳回首页
        if(!this.data.seckillId){
            _mm.goHome();
        }
        //加载图片详情数据
        this.loadPaymentInfo();
    },
    bindEvent: function(){
        var _this = this;
        // 图片预览（鼠标滑过显示大图）
        $(document).on('mouseenter', '.p-img-item', function(){
            var imageUrl   = $(this).find('.p-img').attr('src');
            $('.main-img').attr('src', imageUrl);
        });
        // count的操作（数量加减按钮）
        $(document).on('click', '.p-count-btn', function(){
            var type        = $(this).hasClass('plus') ? 'plus' : 'minus',
                $pCount     = $('.p-count'),
                currCount   = parseInt($pCount.val()),	//当前选择了多少
                minCount    = 1,
                maxCount    = _this.data.detailInfo.seckillStock || 1;   //不能超过现有的库存
            if(type === 'plus'){
                $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
            }
            else if(type === 'minus'){
                $pCount.val(currCount > minCount ? currCount - 1 : minCount);
            }
        });
        // 直接进入订单页面
        $(document).on('click', '.seckill-add', function(){
            _seckill.seckill({
                seckillId   : _this.data.seckillId,
                token       : _this.data.detailInfo.token,
                count       : $('.p-count').val()
            }, function(res){
                //跳转秒杀订单页面
                window.location.href = './order-seckill.html?seckillId='+res.id;
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    // 加载商品详情的数据
    loadPaymentInfo: function(){
    	var _this       = this,
            html        = '',
            $pageWrap   = $('.page-wrap');
        // loading
        $pageWrap.html('<div class="loading"></div>');
        // 请求detail信息
        _seckill.getSeckillDetail(this.data.seckillId, function(res){
        	//将图片字符串转换成数组
            _this.filter(res);
            //读取时间参数
            _this.data.start = res.start;
            _this.data.now = res.now;
            _this.data.end = res.end;
            // 缓存住detail的数据（供事件绑定用）
            _this.data.detailInfo = res;
            // render
            html = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(html);
            //实现倒计时效果
            _this.countdown();
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">此商品太淘气，找不到了</p>');
        });
    },
    // 数据匹配(将字符串转换成数组)
    filter : function(data){
        data.subImages = data.subImages.split(',');
    },
    // 倒计时逻辑
    countdown : function(){
        //显示倒计时
        var _this = this;
        var start = _this.data.start;
        var now = _this.data.now;
        var end = _this.data.end;
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
                //时间格式
                var format = event.strftime('<span class="s-date day">%D天</span> <span class="s-date hour">%H时</span> <span class="s-date minute">%M分</span> <span class="s-date second">%S秒</span>');
                $('.s-info-plane .s-info').html(format);
                /*时间完成后回调事件*/
            }).on('finish.countdown',function(){
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
    },
}

$(function(){
    page.init();
});