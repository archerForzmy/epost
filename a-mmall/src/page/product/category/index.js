import React from 'react';
import {Link} from 'react-router-dom';

import './index.scss';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import TableList    from 'component/table-list/index.js';

import MMUtil from 'util/mm.js';
import Product from 'service/product.js';

const _mm  = new MMUtil();
const product = new Product();

class ProductCategory extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			list:[],
			parentCategoryId:this.props.match.params.categoryId||0
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadCategoryList();
	}
	//组件再次加载
	componentDidUpdate(prevProps,prevState){
		let oldPath = prevProps.location.pathname;
		let newPath = this.props.location.pathname;
		let newId = this.props.match.params.categoryId || 0;
		if(oldPath !== newPath){
			this.setState({
				parentCategoryId:newId
			},()=>{
				this.loadCategoryList();
			})
		}
	}

	//加载分类列表
	loadCategoryList(){
		//品类列表根据父品类id
		product.getCategoryList(this.state.parentCategoryId).then(res=>{
			this.setState({
				list:res
			});
		},errMsg=>{
			this.setState({
				list:[]
			})
			_mm.errorTips(errMsg);
		});
	}

	//修改当前分类的名称
	onUpdateCategoryName(id,name){
		let newName = window.prompt('请输入要修改的品类名称',name);
		if(newName){
			product.updateCategoryName({
				categoryId:id,
				categoryName:newName
			}).then(res=>{
				_mm.successTips(res);
				this.loadCategoryList();
			},errMsg=>{
				_mm.errorTips(errMsg);
			});
		}
	}
	render(){
		let tableHeads =[
			{name:'分类编号',width:'40%'},
			{name:'分类名称',width:'40%'},
			{name:'操作',width:'30%'}
		];

		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="分类列表">
					<div className="page-header-right">
						<Link to="/product-category/save" className="btn btn-primary">
							<i className="fa fa-plus"></i>
							添加分类
						</Link>
					</div>
				</PageTitle>
				<div className="row">
					<div className="col-md-12">
						<p>父品类Id：{this.state.parentCategoryId}</p>
					</div>
				</div>
                <TableList tableHeads={tableHeads}>
                	{
                		this.state.list.map((category,index)=>{
							return (
								<tr key={index}>
									<td>{category.id}</td>
									<td>{category.name}</td>
									<td>
										<a className="operator" 
											onClick={e=>{this.onUpdateCategoryName(category.id,category.name)}}>修改分类</a>
										{
											category.parentId ===0 ?
											<Link className="operator" to={`/product-category/index/${category.id}`}>查看下级</Link>:null
										}
									</td>
								</tr>
							);
						})
                	}
                </TableList>
			</div>		
		);
	}
}

export default ProductCategory;
