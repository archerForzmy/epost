import React from 'react';
import {Link} from 'react-router-dom';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';

import MMUtil from 'util/mm.js';
import Product from 'service/product.js';

const _mm  = new MMUtil();
const product = new Product();

class ProductCategorySave extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			categorylist:[],
			parentId:0,
			categoryName:''
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadCategoryList();
	}

	//加载分类列表
	loadCategoryList(){
		//品类列表根据父品类id
		product.getCategoryList(0).then(res=>{
			this.setState({
				categorylist:res
			});
		},errMsg=>{
			_mm.errorTips(errMsg);
		});
	}
	//下拉列表更新
	onChangeValue(e){
		let value = e.target.value.trim(),
			name = e.target.name;
		this.setState({
			[name]:value
		});
	}

	//新增分类
	onSubmit(e){
		let categoryName = this.state.categoryName.trim();
		if(categoryName){
			product.saveCategory({
				parentId:this.state.parentId,
				categoryName:categoryName
			}).then(res=>{
				_mm.successTips(res);
				this.props.history.push('/product-category/index');
			},errMsg=>{
				_mm.successTips(res);
			});
		}else{
			_mm.successTips('分类名不能为null');
		}
	}

	render(){
		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="添加分类"/>
				<div className="row">
					<div className="col-md-12">
						<div className="form-horizontal">
  							<div className="form-group">
    							<label className="col-md-2 control-label">所属品类</label>
    							<div className="col-md-5">
    								<select name="parentId" className="form-control" 
    									onChange={(e)=>{this.onChangeValue(e)}}>
    									<option value="0">根品类/</option>
    									{
    										this.state.categorylist.map((category,index)=>{
    											return <option value={category.id} key={index}>根品类/{category.name}</option>
    										})
    									}
    								</select>
    							</div>
  							</div>
  							<div className="form-group">
    							<label className="col-md-2 control-label">分类名称</label>
	    						<div className="col-md-5">
						    		<input type="text" 
						    			className="form-control" 
						    			placeholder="请输入分类名商品描述"
						    			name="categoryName"
    									onChange={(e)=>{this.onChangeValue(e)}}/>
								</div>
  							</div>  
							<div className="form-group">
					    		<div className="col-md-offset-2 col-md-10">
					      			<button type="submit" 
					      				className="btn btn-default"
					      				onClick={(e)=>{this.onSubmit(e)}}>提交</button>
					    		</div>
							</div>
						</div>
					</div>
				</div>
                
			</div>		
		);
	}
}

export default ProductCategorySave;