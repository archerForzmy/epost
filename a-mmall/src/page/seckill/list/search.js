import React from 'react';

// 商品搜索组件
class SeckillSearch extends React.Component{
    constructor(props){
		super(props);
        this.state={
            searchType:'seckillId',  //seckillId,seckillName
            searchKeyword:''
        };
	}
    //搜索类型或者关键字改变
    onValueChange(e){
        let name = e.target.name,
            value = e.target.value.trim();
        this.setState({
            [name]:value
        });
    }
    //点击搜索按钮
    onSearch(){
        this.props.onSearch(this.state.searchType,this.state.searchKeyword);
    }
    render() {
        return (
        	 <div className="row search-wrap">
                    <div className="col-md-12">
                        <div className="form-inline">
                            <div className="form-group">
                                <select className="form-control" 
                                    onChange={(e)=>this.onValueChange(e)}
                                    name="searchType">
                                    <option value="seckillId">秒杀编号</option>
                                    <option value="seckillName">活动名称</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" 
                                    className="form-control" 
                                    placeholder="关键词"
                                    name="searchKeyword"
                                    onChange={(e)=>this.onValueChange(e)}/>
                            </div>
                            <button className="btn btn-primary"
                                onClick={e=>this.onSearch()}>查询</button>
                        </div>
                    </div>
            </div>		
        );        
    }
}

export default SeckillSearch;