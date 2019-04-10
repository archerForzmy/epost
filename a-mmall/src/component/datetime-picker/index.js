import React from 'react';

// 日期选择器
class DatetimePicker extends React.Component{
    constructor(props){
		super(props); 
        this.state={
            time:''   //日期
        };
	}

    //组件初始化
    componentDidMount(){
        var that =  this;
        $('#'+this.props.dateId).datetimepicker({
            format: 'YYYY/MM/DD hh:mm:ss',
        }).bind("dp.change",function(e){
            let date = new Date(e.date);
            that.setState({
                //time:date.toLocaleString()
                time:date.format("yyyy-MM-dd hh:mm:ss")
            })
            //回调父模块方法
            that.props.onDateValueChange(that.state.time,that.props.datetype);
        });
    }


    render() {
        //重写date方法
        Date.prototype.format = function(format) { 
            /* 
            * 使用例子:format="yyyy-MM-dd hh:mm:ss"; 
            */ 
            var o = { 
                "M+" : this.getMonth() + 1, // month 
                "d+" : this.getDate(), // day 
                "h+" : this.getHours(), // hour 
                "m+" : this.getMinutes(), // minute 
                "s+" : this.getSeconds(), // second 
                "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter 
                "S" : this.getMilliseconds() 
            } 

            if (/(y+)/.test(format)) { 
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
            } 

            for (var k in o) { 
                if (new RegExp("(" + k + ")").test(format)) { 
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); 
                } 
            } 
            return format; 
        }

        return (
        	<div className="col-md-5">
                <div class='input-group date' id={this.props.dateId}>
                    <input type='text' class="form-control"
                        value={
                            typeof this.props.dateTime === 'string' ? 
                            this.props.dateTime
                            :new Date(this.props.dateTime).format("yyyy-MM-dd hh:mm:ss")
                        }/>
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-calendar"></span>
                    </span>
                </div>
            </div>
        );        
    }
}

export default DatetimePicker;