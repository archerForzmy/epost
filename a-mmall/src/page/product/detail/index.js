import React from 'react';
import {Link,NavLink} from 'react-router-dom';

import '../save/index.scss';
//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import CategorySelector from '../save/select.js';

import MMUtil from 'util/mm.js';
import Product from 'service/product.js';

const _mm  = new MMUtil();
const product = new Product();

class ProductDetail extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id:this.props.match.params.pid,  //获取url参数
			categoryId:0,
			parentCategoryId:0,
			subImages:[],
			detail:'',
			name:'',
			subtitle:'',
			price:'',
			stock:'',
			status:1 //商品在售状态
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadProduct();
	}

	//加载商品详情
	loadProduct(){
		if(this.state.id){
			product.getProduct(this.state.id).then(res=>{
				//将字符串转成数组
				let images = res.subImages.split(',');
				res.subImages = images.map((imgUrl)=>{
					return {
						uri:imgUrl,
						url:res.imageHost+imgUrl
					}
				});
				this.setState(res);
			},errMsg=>{
				_mm.errorTips(errMsg);
			})
		}
	}

	render(){
		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="添加商品"/>
                <div className="form-horizontal">
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品名称</label>
    					<div className="col-md-5">
    						<p className="form-control-static">{this.state.name}</p>
    					</div>
  					</div>
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品描述</label>
	    				<div className="col-md-5">
						    <p className="form-control-static">{this.state.subtitle}</p>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">所属分类</label>
	    				<CategorySelector 
	    					categoryId={this.state.categoryId} 
	    					parentCategoryId={this.state.parentCategoryId}/>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品价格</label>
	    				<div className="col-md-3">
	    					<p className="form-control-static">{this.state.price}元</p>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品库存</label>
	    				<div className="col-md-3">
	    					<p className="form-control-static">{this.state.stock}件</p>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品图片</label>
						<div className="col-md-offset-2 col-md-10">
							{
								this.state.subImages.length ? this.state.subImages.map(
									(image,index) => (
										<div className="img-con" key={index}>
											<img className="img" src={image.url}/>
										</div>)
								):(<div>暂无图片</div>)
							}
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品描述</label>
	    				<div className="col-md-10" dangerouslySetInnerHTML={{__html:this.state.detail}}>
						</div>
  					</div> 
				</div>
			</div>		
		);
	}
}

export default ProductDetail;
