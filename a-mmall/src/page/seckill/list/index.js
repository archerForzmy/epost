import React from 'react';
import {Link} from 'react-router-dom';
//引入样式
import './index.scss';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import Pagination    from 'component/pagination/index.js';
import TableList    from 'component/table-list/index.js';
import SeckillSearch    from './search.js';

import MMUtil from 'util/mm.js';
import Seckill from 'service/seckill.js';

const _mm  = new MMUtil();
const seckill = new Seckill();

class SeckillList extends React.Component{
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
		this.loadSeckillList();
	}

	//加载商品列表
	loadSeckillList(){
		let listParam = {};
		listParam.listType = this.state.listType;
		listParam.pageNum = this.state.pageNum;
		if(this.state.listType==='search'){
			listParam.searchType = this.state.searchType;
			listParam.searchKeyword = this.state.searchKeyword;
		}

		seckill.getSeckillList(listParam).then(res=>{
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
			this.loadSeckillList();
		})
	}

	//点击搜索按钮
	onSearch(searchType,searchKeyword){
		let listType = searchKeyword==='' ? 'list':'search';
		this.setState({
			pageNum:1,
			listType:listType,
			searchType:searchType,
			searchKeyword:searchKeyword
		},()=>{
			//重新加载页面
			this.loadSeckillList();
		})
	}

	render(){
		let tableHeads =[
			{name:'秒杀编号',width:'10%'},
			{name:'活动名称',width:'25%'},
			{name:'开始时间',width:'20%'},
			{name:'结束时间',width:'20%'},
			{name:'秒杀价',width:'10%'},
			{name:'操作',width:'15%'}
		];

		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="秒杀列表">
					<div className="page-header-right">
						<Link to="/seckill/save" className="btn btn-primary">
							<i className="fa fa-plus"></i>
							添加秒杀
						</Link>
					</div>
				</PageTitle>
				<SeckillSearch onSearch={(searchType,searchKeyword)=>{this.onSearch(searchType,searchKeyword)}}/>
                <TableList tableHeads={tableHeads}>
                	{
                		this.state.list.map((seckill,index)=>{
							return (
								<tr key={index}>
									<td>{seckill.id}</td>
									<td>{seckill.name}</td>
									<td>{new Date(seckill.start).toLocaleString()}</td>
									<td>{new Date(seckill.end).toLocaleString()}</td>
									<td>￥{seckill.price}</td>
									<td>
										<Link className="operator" to={`/seckill/save/${seckill.id}`}>编辑</Link>
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

export default SeckillList;