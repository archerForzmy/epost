require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _product        = require('service/product-service.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');
var templateComment = require('./comment.string');
 
var page = {
    data: {
        username  : "",
        productId : _mm.getUrlParam('productId') || '',
        comment:{
            score:5,
            body:"",
            type:1
        }
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        var that = this;
        // 如果没有传productId, 自动跳回首页
        if(!this.data.productId){
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
                maxCount    = _this.data.detailInfo.stock || 1;   //不能超过现有的库存
            if(type === 'plus'){
                $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
            }
            else if(type === 'minus'){
                $pCount.val(currCount > minCount ? currCount - 1 : minCount);
            }
        });
        // 加入购物车
        $(document).on('click', '.cart-add', function(){
            _cart.addToCart({
                productId   : _this.data.productId,
                count       : $('.p-count').val()
            }, function(res){
                window.location.href = './result.html?type=cart-add';
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
        //tab切换
        $(document).on('click', '.tab-item', function(e){
            var index = $(e.target).data("index");
            if(!$(e.target).hasClass('active')){
                //修改tab样式
                $(e.target).addClass('active').siblings().removeClass('active');
                $(".detail-con:eq("+index+")").addClass('active').siblings().removeClass('active');
            }
        });   
        //分页事件绑定 
        $(document).on('click', '.page-index', function(e){
            var index = $(e.target).data("index");
            _this.loadComments(index-1,5);
        });
        $(document).on('click', '.page-has', function(e){
            
            if($(e.target).hasClass('next')){
                _this.loadComments(_this.data.comments.pageNum,5);
            }else{
                _this.loadComments(_this.data.comments.pageNum-2,5);
            }
        });
        //评分插件
        $(document).on('click', '.c-star', function(e){
            var index =  $(e.target).data("index");
            _this.data.comment.score = index;
            $(".c-star").removeClass('active');
            $(e.target).addClass('active').prevAll().addClass('active');
        });
        //评论插件
        $(document).on('click', '.comment-type .type', function(e){
            var index =  $(e.target).data("index");
            _this.data.comment.type = index;
            $(".comment-type .type").removeClass('active');
            $(e.target).addClass('active');
        });
        //文本输入区域
        $(document).on('keyup', '.comment-body-content', function(e){
            _this.data.comment.body = $(e.target).val();
        });
        //提交评论事件
        $(document).on('click', '.comment-submint', function(e){
            _this.sendComment();
            //清除样式
            $(".comment-type .type").removeClass('active');
            $(".c-star").removeClass('active');
            $(".comment-body-content").val();
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
        _product.getProductDetail(this.data.productId, function(res){
        	//将图片字符串转换成数组
            _this.filter(res);
            // 缓存住detail的数据（供事件绑定用）
            _this.data.detailInfo = res;
            // render
            html = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(html);
            //加载第一页评论信息
            _this.loadComments(0,5);
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">此商品太淘气，找不到了</p>');
        });

    },
    // 数据匹配(将字符串转换成数组)
    filter : function(data){
        data.subImages = data.subImages.split(',');
    },
    //加载评论数据
    loadComments:function(pageNum,pageSize){
        var _this = this;
        var types=['默认','好评','中评','差评'];
        //加载评论
         _product.getProductComments({
            productId:this.data.productId,
            pageNum:pageNum,
            pageSize:pageSize   
        },function(res){
            _this.data.comments = res;
            //加载评论数据
            res.list = res.list.map(function(comment,index){
                comment.createTime = _mm.formatdate(new Date(comment.createTime));
                comment.type = types[comment.type];
                var arr = [true,true,true,true,true];
                for(var i= comment.score;i<5;i++){
                    arr[i] = false;
                }    
                comment.score = arr;
                return comment;
            });
            //分页数据
            var pages = [];
            for(var i = res.start;i<=res.end;i++){
                pages.push(i);
            }
            //渲染分页数据
            var pageInfo = {
                pages:pages,
                pageNum:res.pageNum,
                hasPre:res.hasPre,
                hasNext:res.hasNext
            }   
            //渲染模板 
            html = _mm.renderHtml(templateComment, {
                comments:res.list,
                pageInfo:pageInfo
            }); 
            //将数据挂载到页面中
            $(".comment-page-info").html(html);
            //修改选中页样式
            $(".page-index:eq("+(res.pageNum-1)+")").addClass('active');
        },function(errMsg){
            //加载失败
            _mm.errorTips(errMsg);
        });
    },
    //添加评论
    sendComment:function(){
        if(this.data.comment.body.length==0){
            _mm.errorTips("请输入评价内容");
        }

        var _this = this;
        _product.insertComments({
            productId:this.data.productId,
            score:this.data.comment.score,
            body:this.data.comment.body,
            type:this.data.comment.type,
            createTime:_mm.formatdate(new Date())
        },function(res){
            //跳转到尾页
            _this.loadComments(_this.data.comments.pageIndex-1,5);
        },function(errMsg){
            //加载失败
            _mm.errorTips(errMsg);
        });
    }
}

$(function(){
    page.init();
});