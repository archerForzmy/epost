require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _order          = require('service/order-service.js');
var _address        = require('service/address-service.js');
var templateAddress = require('./address-list.string');
var templateProduct = require('./product-list.string');

var addressModal    = require('./address-modal.js');

var page = {
    data: {
      	selectedAddressId: null    //当前选择的地址的id
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        //加载地址列表
        this.loadAddressList();
        //加载商品列表
        this.loadProductList();
    },
    bindEvent: function(){
        var _this = this;
        // 地址的选择
        $(document).on('click', '.address-item', function () {
        	//更新样式
            $(this).addClass('active')
                .siblings('.address-item').removeClass('active');
            //缓存下当前点击的地址id
            _this.data.selectedAddressId = $(this).data('id');
        });
        // 订单提交
        $(document).on('click', '.order-submit', function () {
            var shippingId = _this.data.selectedAddressId;
            if (shippingId) {
            	//创建一个订单
                _order.createOrder({
                    shippingId: shippingId
                }, function (res) {
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                }, function (errMsg) {
                    _mm.errorTips(errMsg)
                });
            } else {
                _mm.errorTips('请选择地址后提交');
            }
        });
        // 添加地址（弹出对话框）
        $(document).on('click', '.address-add', function () {
            addressModal.show({
                isUpdate : false,
                onSuccess: function () {
                	//重新加载地址列表
                    _this.loadAddressList();
                }
            });
        });
        // 编辑地址
        $(document).on('click', '.address-update', function (e) {
        	//点击按钮避免点击父元素（地址框状态不能选择）
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data('id');
            _address.getAddress(shippingId, function (res) {
                addressModal.show({
                    isUpdate : true,
                    data     : res,
                    onSuccess: function () {
                        _this.loadAddressList();
                    }
                })
            }, function (errMsg) {
                _mm.errorTips(errMsg);
            });
        });
        // 地址的删除
        $(document).on('click', '.address-delete', function (e) {
        	//点击按钮避免点击父元素（地址框状态不能选择）
            e.stopPropagation();
            var id = $(this).parents('.address-item').data('id');
            if (window.confirm('确认要删除该地址？')) {
                _address.deleteAddress(id, function (res) {
                    _this.loadAddressList();
                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    // 加载地址列表信息
    loadAddressList: function () {
        var _this = this;
        $('.address-con').html('<div class="loading"></div>');
        //获取地址列表
        _address.getAddressList(function (res) {
           	_this.addressFilter(res);
            var addressListHtml = _mm.renderHtml(templateAddress, res);
            $('.address-con').html(addressListHtml);
        }, function (errMsg) {
            $('.address-con').html('<p class="err-tip">地址加载失败，请刷新</p>');
        });
    },
    // 处理地址列表中选中状态(避免修改或者删除其他地址引起选中状态的消失)
    addressFilter  : function (data) {
        if (this.data.selectedAddressId) {
            var selectedAddressIdFlag = false;
            for (var i = 0, length = data.list.length; i < length; i++) {
                if (data.list[i].id === this.data.selectedAddressId) {
                    data.list[i].isActive = true;
                    selectedAddressIdFlag = true;
                }
            }
            // 如果以前选中的地址不在列表里，将其删除
            if (!selectedAddressIdFlag) {
                this.data.selectedAddressId = null;
            }
        }
    },
    // 加载商品清单（当前购物车的所有商品）
    loadProductList: function () {
        var _this = this;
        $('.product-con').html('<div class="loading"></div>');
        //获取地址列表
        _order.getProductList(function (res) {
            var productListHtml = _mm.renderHtml(templateProduct, res);
            $('.product-con').html(productListHtml);
        }, function (errMsg) {
            $('.product-con').html('<p class="err-tip">商品清单加载失败，请刷新</p>');
        });
    }
}

$(function(){
    page.init();
});