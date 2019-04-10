import React from 'react';

// 通用表格列表
class TableList extends React.Component{
    constructor(props){
		super(props);
		this.state = {
			fristLoading:true
		};
	}

	//第二次加载插件
	componentWillReceiveProps(){
		this.setState({
			fristLoading:false
		});
	}

    render() {
    	let tableHeader = this.props.tableHeads.map((tableHead,index)=>{
    		if(typeof tableHead === 'object'){
    			return <th key={index} width={tableHead.width}>{tableHead.name}</th>
    		}else if(typeof tableHead === 'string'){
    			return <th key={index}>{tableHead}</th>
    		}

    	});
    	let tableList = this.props.children;
    	let errorBody = (
			<tr>
				<td colSpan={this.props.tableHeads.length} className="text-center">
					{this.state.fristLoading?'正在加载':'没有结果'}
				</td>
			</tr>
		);

		let tableBody = tableList.length > 0 ? tableList:errorBody;
        return (
        	 <div className="row">
					<div className="col-md-12">
						<table className="table table-striped table-bordered">
							<thead>
								<tr>
									{tableHeader}
								</tr>
							</thead>
							<tbody>
								{tableBody}
							</tbody>
						</table>
					</div>
			</div>
        );        
    }
}

export default TableList;