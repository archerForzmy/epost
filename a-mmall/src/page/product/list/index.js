import React from 'react';
import {Link} from 'react-router-dom';
//引入样式
import './index.scss'

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import Pagination    from 'component/pagination/index.js';
import TableList    from 'component/table-list/index.js';
import ProductSearch    from './search.js';

import MMUtil from 'util/mm.js';
import Product from 'service/product.js';

const _mm  = new MMUtil();
const product = new Product();

class ProductList extends React.Component{
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
		this.loadProductList();
	}

	//加载商品列表
	loadProductList(){
		let listParam = {};
		listParam.listType = this.state.listType;
		listParam.pageNum = this.state.pageNum;
		if(this.state.listType==='search'){
			listParam.searchType = this.state.searchType;
			listParam.searchKeyword = this.state.searchKeyword;
		}

		product.getProductList(listParam).then(res=>{
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
			this.loadProductList();
		})
	}

	//上下架方法
	onSetProductStatus(e,productId,currentStatus){
		//取反状态
		let newStatus = currentStatus ==1 ? 2 : 1,
			confirmTips = currentStatus ==1 ? '确定下架' : '确定上架';
		if(window.confirm(confirmTips)){
			product.setProductStatus({
				productId:productId,
				status:newStatus
			}).then(res =>{
				_mm.successTips(res);
				//重新加载页面
				this.loadProductList();
			},errorMsg=>{
				_mm.errorTips(errMsg);
			})
		}

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
			this.loadProductList();
		})
	}

	render(){
		let tableHeads =[
			{name:'商品编号',width:'10%'},
			{name:'商品信息',width:'50%'},
			{name:'价格',width:'10%'},
			{name:'状态',width:'15%'},
			{name:'操作',width:'15%'}
		];

		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="商品列表">
					<div className="page-header-right">
						<Link to="/product/save" className="btn btn-primary">
							<i className="fa fa-plus"></i>
							添加商品
						</Link>
					</div>
				</PageTitle>
				<ProductSearch onSearch={(searchType,searchKeyword)=>{this.onSearch(searchType,searchKeyword)}}/>
                <TableList tableHeads={tableHeads}>
                	{
                		this.state.list.map((product,index)=>{
							return (
								<tr key={index}>
									<td>{product.id}</td>
									<td>
										<p>{product.name}</p>
										<p>{product.subtitle}</p>
									</td>
									<td>￥{product.price}</td>
									<td>
										<p>{product.status==1?'在售':'已下架'}</p>
										<button className="btn btn-xs btn-warning" 
											onClick={(e)=>{this.onSetProductStatus(e,product.id,product.status)}}>
											{product.status==1?'下架':'上架'}
										</button>
									</td>
									<td>
										<Link className="operator" to={`/product/detail/${product.id}`}>详情</Link>
										<Link className="operator" to={`/product/save/${product.id}`}>编辑</Link>
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

export default ProductList;