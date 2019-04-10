import React from 'react';

// 广告搜索组件
class PropagandaSearch extends React.Component{
    constructor(props){
		super(props);
        this.state={
            propagandaName:''
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
        this.props.onSearch(this.state.propagandaName);
    }
    render() {
        return (
        	 <div className="row search-wrap">
                    <div className="col-md-12">
                        <div className="form-inline">
                            <div className="form-group">
                                <input type="text" 
                                    className="form-control" 
                                    placeholder="广告名称"
                                    name="propagandaName"
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

export default PropagandaSearch;