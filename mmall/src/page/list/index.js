require("./index.css");
require("page/common/nav/index.js");
require("page/common/header/index.js");
var _mm = require('util/mm.js');
var _product        = require('service/product-service.js');
var Pagination      = require('util/pagination/index.js');
var templateIndex   = require('./index.string');

var page = {
	data: {
		//分页请求参数
        listParam : {
            keyword         : _mm.getUrlParam('keyword')    || '',
            categoryId      : _mm.getUrlParam('categoryId') || '',
            orderBy         : _mm.getUrlParam('orderBy')    || 'default',
            pageNum         : _mm.getUrlParam('pageNum')    || 1,
            pageSize        : _mm.getUrlParam('pageSize')   || 5
        }
    },
	init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
    	//加载list数据
        this.loadPaymentInfo();
    },
    bindEvent: function(){
    	var _this = this;
        // 排序的点击事件
        $('.sort-item').click(function(){
            var $this = $(this);
            _this.data.listParam.pageNum = 1;
            // 点击默认排序
            if($this.data('type') === 'default'){
                // 已经是active样式
                if($this.hasClass('active')) {
                    return;
                }
                // 其他
                else{
                    $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                    _this.data.listParam.orderBy = 'default';
                }
            }
            // 点击价格排序
            else if($this.data('type') === 'price'){
                // active class 的处理
                $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                // 升序、降序的处理
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'price_asc';
                }else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'price_desc';
                }
            }
            // 点击销量排序
            else if($this.data('type') === 'volume'){
                // active class 的处理
                $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                // 升序、降序的处理
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'volume_asc';
                }else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'volume_desc';
                }
            }
            // 点击评论排序
            else if($this.data('type') === 'comment'){
                // active class 的处理
                $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                // 升序、降序的处理
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'comment_asc';
                }else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'comment_desc';
                }
            }
            // 重新加载列表
            _this.loadPaymentInfo();
        });
    },
     // 加载list数据
    loadPaymentInfo: function(){
    	var _this       = this,
            listHtml    = '',
            listParam   = this.data.listParam,
            $pListCon   = $('.p-list-con');
        $pListCon.html('<div class="loading"></div>');
    	// 请求接口
        _product.getProductList(listParam, function(res){
            listHtml = _mm.renderHtml(templateIndex, {
                list :  res.list 
            });
            //渲染商品列表
            $pListCon.html(listHtml);
            //渲染分页控件
            _this.loadPagination({
                hasPreviousPage : res.hasPreviousPage,
                prePage         : res.prePage,
                hasNextPage     : res.hasNextPage,
                nextPage        : res.nextPage,
                pageNum         : res.pageNum,	  //当前选中的页数
                pages           : res.pages       //总页数
            });
        }, function(errMsg){
            _mm.errorTips(errMsg);
            $pListCon.html('');
        });
    },
    // 加载分页信息
    loadPagination : function(pageInfo){
    	var _this = this;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({}, pageInfo, {
            container : $('.pagination'),
            onSelectPage : function(pageNum){
                _this.data.listParam.pageNum = pageNum;
                _this.loadPaymentInfo();
            }
        }));
    }
}

$(function(){
    page.init();
});