import React from 'react';

// 商品搜索组件
class ProductSearch extends React.Component{
    constructor(props){
		super(props);
        this.state={
            searchType:'prodcutId',  //prodcutId,productName
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
                                    <option value="productId">商品编号</option>
                                    <option value="productName">商品名称</option>
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

export default ProductSearch;