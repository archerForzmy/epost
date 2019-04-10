var receiverInfo = {
    receiverName     : '',
    receiverProvince : '',
    receiverCity     : '',
    receiverAddress  : '',
    receiverPhone    : '',
    receiverZip      : '',
};

(function(mui, doc) {
        var cityPicker3 = new mui.PopPicker({
               layer: 2
        });
        //创建底部三级联动的列表
        cityPicker3.setData(cityData3);
        var area = doc.getElementById('area');
        area.addEventListener('tap', function (event) {  
           cityPicker3.show(function(items) {
                //alert((items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text);
                area.value = (items[0] || {}).text + " " + (items[1] || {}).text;
                receiverInfo.receiverProvince = (items[0].text || '');
                receiverInfo.receiverCity = (items[1].text || '');
           });
        });

        //绑定输入框的改变事件
        var inputs =  doc.getElementsByClassName("mui-input");
        for(var i=0;i<inputs.length;i++){
          inputs[i].addEventListener('change', function (event) {
            var key =  event.target.name;
            var value = event.target.value;
            if(key!==area){
              receiverInfo[key] = value;
            }
          });
        }
        //添加收货地址
        var addAddr = doc.getElementById('addAddr');
        addAddr.addEventListener('tap', function (event){
            //判断字段是否为空
            var result = authItem();
            if(result.result){
              _address.save(receiverInfo,function(res){
                  window.location.href = './address.html';
              },function(err){
                  mui.toast('添加失败');
              });
            }else{
              mui.toast(result.msg);
            }
        });
})(mui, document);

//验证字段是否为空
var authItem = function(){
  if(receiverInfo.receiverName===''){
    return {
        result:false,
        msg:"联系人不能为空"
    };
  }
  if(receiverInfo.receiverProvince===''){
    return  {
        result:false,
        msg:"省份不能为空"
    };
  }
  if(receiverInfo.receiverCity===''){
    return {
        result:false,
        msg:"城市不能为空"
    };
  }
  if(receiverInfo.receiverAddress===''){
    return {
        result:false,
        msg:"消息地址不能为空"
    };
  }
  if(receiverInfo.receiverPhone===''){
    return {
        result:false,
        msg:"联系电话不能为空"
    };
  }
  if(!(/^1[34578]\d{9}$/.test(receiverInfo.receiverPhone))){ 
    return {
        result:false,
        msg:"非法手机号码"
    };
  } 
  if(receiverInfo.receiverZip===''){
    return {
        result:false,
        msg:"邮政编码不能为空"
    };
  }
  if(!(/^[1-9][0-9]{5}$/.test(receiverInfo.receiverZip))){ 
    return {
        result:false,
        msg:"非法邮政编码"
    };
  } 

  return {result:true,msg:'操作成功'};
}

var _address   = {
    // 获取地址列表
    getAddressList: function (resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/list.do'),
            data   : {
                pageSize: 50
            },
            success: resolve,
            error  : reject
        });
    },
    // 新建地址
    save: function (addressInfo, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/add.do'),
            data   : addressInfo,
            success: resolve,
            error  : reject
        });
    },
    // 更新地址
    update: function (addressInfo, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/update.do'),
            data   : addressInfo,
            success: resolve,
            error  : reject
        });
    },
    // 获取单条收件人信息(要更新)
    getAddress: function (shippingId, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/select.do'),
            data   : {
                shippingId: shippingId
            },
            success: resolve,
            error  : reject
        });
    },
    // 删除收件人
    deleteAddress : function (shippingId, resolve, reject) {
        window.mm.request({
            url    : window.mm.getServerUri('/shipping/del.do'),
            data   : {
                shippingId: shippingId
            },
            success: resolve,
            error  : reject
        });
    },
};