require('./index.css');
var _mm  = require('util/mm.js');
var templateIndex  = require('./index.string');

//侧边导航
var navSide = {
    option : {
        name : '',  //选中name
        navList : [
            {name : 'user-center', desc : '个人中心', href: './center.html'},
            {name : 'order-list', desc : '我的订单', href: './order-list.html'},
            {name : 'user-pass-update', desc : '修改密码', href: './pass-update.html'},
            {name : 'about', desc : '关于EPost', href: './about.html'}
        ]
    },
    //传入选中的条目名称
    init : function(option){
        // 将参数option和当前对象的option对象合并
        $.extend(this.option, option);
        this.renderNav();
    },
    //渲染导航菜单
    renderNav : function(){
        //计算active数据
        for(var i = 0,iLength = this.option.navList.length;i<iLength;i++){
            if(this.option.navList[i].name === this.option.name){
                this.option.navList[i].isActive = true;
            }
        }
        //渲染数据
        var navHtml = _mm.renderHtml(templateIndex,{
            navList : this.option.navList
        });
        //将html放入容器
        $('.nav-side').html(navHtml);
    }
};

module.exports  = navSide;