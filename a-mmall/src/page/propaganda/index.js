import React from 'react';
import {Link} from 'react-router-dom';
//引入样式
import './index.scss'

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import Pagination    from 'component/pagination/index.js';
import TableList    from 'component/table-list/index.js';
import PropagandaSearch    from './search.js';

import MMUtil from 'util/mm.js';
import Propaganda from 'service/propaganda.js';

const _mm  = new MMUtil();
const propaganda = new Propaganda();

class PropagandaList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			pageNum:1,
			list:[],
			listType:'list'
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadPropagandaList();
	}

	//加载商品列表
	loadPropagandaList(){
		let listParam = {};
		listParam.listType = this.state.listType;
		listParam.pageNum = this.state.pageNum;
		if(this.state.listType==='search'){
			listParam.propagandaName = this.state.propagandaName;
		}

		propaganda.getPropagandaList(listParam).then(res=>{
			this.setState(res);
		},errMsg=>{
			_mm.errorTips(errMsg);
		});
	}

	//页码改变
	onPageNumChange(pageNum){
		this.setState({
			pageNum:pageNum
		},()=>{
			this.loadPropagandaList();
		})
	}

	//点击搜索按钮
	onSearch(propagandaName){
		let listType = propagandaName==='' ? 'list':'search';
		this.setState({
			pageNum:1,
			listType:listType,
			propagandaName:propagandaName
		},()=>{
			//重新加载页面
			this.loadPropagandaList();
		})
	}

	render(){
		let tableHeads =[
			{name:'广告编号',width:'20%'},
			{name:'广告名称',width:'30%'},
			{name:'图片',width:'30%'},
			{name:'排序',width:'10%'},
			{name:'操作',width:'10%'}
		];

		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="广告列表">
					<div className="page-header-right">
						<Link to="/propaganda/save" className="btn btn-primary">
							<i className="fa fa-plus"></i>
							添加广告
						</Link>
					</div>
				</PageTitle>
				<PropagandaSearch onSearch={(propagandaName)=>{this.onSearch(propagandaName)}}/>
                <TableList tableHeads={tableHeads}>
                	{
                		this.state.list.map((propaganda,index)=>{
							return (
								<tr key={index}>
									<td>{propaganda.id}</td>
									<td>{propaganda.name}</td>
									<td><img className="p-img" src={`${propaganda.imageHost}${propaganda.image}`}/></td>
									<td>{propaganda.sort}</td>
									<td>
										<Link to={`/propaganda/save/${propaganda.id}`}>编辑</Link>
									</td>
								</tr>
							);
						})
                	}
                </TableList>
				<Pagination current={this.state.pageNum} 
					total={this.state.total} 
					onChange={(pageNum) => {this.onPageNumChange(pageNum)}}/>
			</div>		
		);
	}
}

export default PropagandaList;