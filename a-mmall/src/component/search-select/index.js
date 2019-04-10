import React from 'react';
import './index.scss';

// 带搜索的下拉列表
class SearchSelect extends React.Component{
    constructor(props){
		super(props);

	}

    //当props改变时候回调
    componentWillReceiveProps(nextProps){
        if(this.props.id !== nextProps.id){
            this.selector.selectpicker('val',nextProps.id);
        }
    }

    //组件初始化
    componentDidMount(){
        this.selector = $(".selectpicker");
        //设置选中事件
        //$('.selectpicker').on('changed.bs.select',function(e){});
    }

    componentDidUpdate(){
        //重新加载组件
        this.selector.selectpicker('reflash');
    }

    //输入框值改变
    onValueChange(e){
        //去除选中的值
        let value = this.selector.val();
        //回调父组件的方法    
        this.props.onSelectValueChange(value[0]);
    }

    render() {
        return (
        	<div className="col-md-5 selectSearch">
                    <select className="selectpicker" 
                        multiple data-live-search="true" 
                        data-max-options="1"
                        onChange={(e)=>{this.onValueChange(e)}}>
                        {
                            this.props.dataList.map((item,index)=>{
                                return (
                                    <option key={index} value={item.id}>{item.value}</option>
                                );
                            })
                        }
                        </select>
            </div>
        );        
    }
}

export default SearchSelect;