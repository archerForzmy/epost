import React from 'react';
import {Link} from 'react-router-dom';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import Pagination    from 'component/pagination/index.js';
import TableList    from 'component/table-list/index.js';
import OrderSearch    from './search.js';

import MMUtil from 'util/mm.js';
import Order from 'service/order.js';

const _mm  = new MMUtil();
const order = new Order();

class OrderList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			pageNum:1,
			list:[],
			listType:'list'  //list search
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadOrderList();
	}

	//加载商品列表
	loadOrderList(){
		let listParam = {};
		listParam.listType = this.state.listType;
		listParam.pageNum = this.state.pageNum;
		if(this.state.listType==='search'){
			listParam.orderNo = this.state.orderNumber;
		}

		order.getOrderList(listParam).then(res=>{
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
			this.loadOrderList();
		})
	}

	//点击搜索按钮
	onSearch(orderNumber){
		let listType = orderNumber==='' ? 'list':'search';
		this.setState({
			pageNum:1,
			listType:listType,
			orderNumber:orderNumber
		},()=>{
			//重新加载页面
			this.loadOrderList();
		})
	}

	render(){
		let tableHeads =[
			{name:'订单号',width:'20%'},
			{name:'收件人',width:'15%'},
			{name:'订单状态',width:'15%'},
			{name:'订单总价',width:'15%'},
			{name:'创建时间',width:'20%'},
			{name:'操作',width:'15%'},
		];

		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="订单列表"/>
				<OrderSearch onSearch={(orderNumber)=>{this.onSearch(orderNumber)}}/>
                <TableList tableHeads={tableHeads}>
                	{
                		this.state.list.map((order,index)=>{
							return (
								<tr key={index}>
									<td>{order.orderNo}</td>
									<td>{order.receiverName}</td>
									<td>{order.statusDesc}</td>
									<td>￥{order.payment}</td>
									<td>{order.createTime}</td>
									<td>
										<Link to={`/order/detail/${order.orderNo}`}>详情</Link>
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

export default OrderList;