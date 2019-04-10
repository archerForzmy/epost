import React from 'react';
import {Link} from 'react-router-dom';
//引入样式
import './index.scss';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import Pagination    from 'component/pagination/index.js';
import TableList    from 'component/table-list/index.js';
import CreditSearch    from './search.js';

import MMUtil from 'util/mm.js';
import Seckill from 'service/seckill.js';

const _mm  = new MMUtil();
const seckill = new Seckill();

class SeckillCredit extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			pageNum:0,
			list:[],
			listType:'list'
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadCreditList();
	}

	//加载商品列表
	loadCreditList(){
		let listParam = {};
		listParam.listType = this.state.listType;
		listParam.pageNum = this.state.pageNum;
		if(this.state.listType==='search'){
			listParam.searchType = this.state.searchType;
			listParam.searchKeyword = this.state.searchKeyword;
		}

		seckill.getCreditList(listParam).then(res=>{
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
			this.loadCreditList();
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
			this.loadCreditList();
		})
	}

	render(){
		let tableHeads =[
			{name:'活动编号',width:'10%'},
			{name:'活动名称',width:'25%'},
			{name:'开始时间',width:'20%'},
			{name:'结束时间',width:'20%'},
			{name:'积分',width:'10%'},
			{name:'操作',width:'15%'}
		];

		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="活动列表">
					<div className="page-header-right">
						<Link to="/seckill-credit/save" className="btn btn-primary">
							<i className="fa fa-plus"></i>
							添加活动
						</Link>
					</div>
				</PageTitle>
				<CreditSearch onSearch={(searchType,searchKeyword)=>{this.onSearch(searchType,searchKeyword)}}/>
                <TableList tableHeads={tableHeads}>
                	{
                		this.state.list.map((credit,index)=>{
							return (
								<tr key={index}>
									<td>{credit.id}</td>
									<td>{credit.name}</td>
									<td>{new Date(credit.start).toLocaleString()}</td>
									<td>{new Date(credit.end).toLocaleString()}</td>
									<td>￥{credit.price}</td>
									<td>
										<Link className="operator" to={`/seckill/credit-save/${credit.id}`}>编辑</Link>
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

export default SeckillCredit;