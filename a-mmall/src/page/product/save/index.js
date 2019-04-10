import React from 'react';
import {Link,NavLink} from 'react-router-dom';

import './index.scss';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import CategorySelector from './select.js';
import FileUploader from 'component/file-upload/index.js';
import RichEditor from 'component/rich-editor/index.js';

import MMUtil from 'util/mm.js';
import Product from 'service/product.js';

const _mm  = new MMUtil();
const product = new Product();

class ProductSave extends React.Component{
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
			volume:0,
			comment:0,
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
				res.defaultDetail = res.detail;
				console.log(res);
				this.setState(res);
			},errMsg=>{
				_mm.errorTips(errMsg);
			})
		}
	}

	//选择品类
	onCategoryChangable(categoryId,parentCategoryId){
		this.setState({
			categoryId:categoryId,
			parentCategoryId:parentCategoryId
		});
	}

	//图片上传成功
	uploadSuccess(res){
		let subImages = this.state.subImages;
		subImages.push(res);
		this.setState({
			subImages:subImages
		})
	}

	//图片上传失败
	uploadError(error){
		_mm.errorTips(error);
	}

	//删除上传好的图片
	deleteUploadImage(e){
		let index = parseInt(e.target.getAttribute('index')),
			subImages = this.state.subImages;
		subImages.splice(index,1);
		this.setState({
			subImages:subImages
		})
	}

	//富文本内容改变回调
	getRichEditorValue(value){
		this.setState(
			{
				detail:value
			}
		);
	}

	//商品名，描述，库存，金额字段修改的事件
	onValueChange(e){
		let value = e.target.value.trim(),
			name = e.target.name;
		this.setState({
			[name]:value
		});
	}

	//商品更新或者新增
	onSubmit(e){
		let productItem = {
			name:this.state.name,
			subtitle:this.state.subtitle,
			price:parseFloat(this.state.price),
			stock:parseInt(this.state.stock),
			detail:this.state.detail,
			categoryId:parseInt(this.state.categoryId),
			subImages:this.state.subImages.map((image)=>image.uri).join(','), //只上传图片名
			status:this.state.status,
			volume:parseInt(this.state.volume),
			comment:parseInt(this.state.comment),
		}
		//设置id
		if(this.state.id){
			productItem.id = this.state.id;
		}
		//校验提交上去的内容
		let checkResult = product.checkProduct(productItem);
		if(checkResult.status){
			product.saveProduct(productItem).then((res) =>{
				_mm.successTips(res);
				//跳转到商品列表页
				this.props.history.push('/product/index');
			},(errMsg) =>{
				_mm.errorTips(errMsg);
			})
		}else{
			_mm.errorTips(checkResult.msg);
		}
	}

	render(){
		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="编辑商品"/>
                <div className="form-horizontal">
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品名称</label>
    					<div className="col-md-5">
    						<input type="text" 
    							className="form-control" 
    							placeholder="请输入商品名称"
    							name="name"
    							value={this.state.name}
    							onChange={(e)=>{this.onValueChange(e)}}/>
    					</div>
  					</div>
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品描述</label>
	    				<div className="col-md-5">
						    <input type="text" 
						    	className="form-control" 
						    	placeholder="请输入商品描述"
						    	name="subtitle"
						    	value={this.state.subtitle}
    							onChange={(e)=>{this.onValueChange(e)}}/>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">所属分类</label>
	    				<CategorySelector 
	    					categoryId={this.state.categoryId} 
	    					parentCategoryId={this.state.parentCategoryId}
	    					onCategoryChangable={(categoryId,parentCategoryId)=>{this.onCategoryChangable(categoryId,parentCategoryId)}}/>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品价格</label>
	    				<div className="col-md-3">
	    					<div className="input-group">
						    	<input type="number" 
						    		className="form-control" 
						    		placeholder="请输入商品价格金额"
						    		name="price"
						    		value={this.state.price}
    								onChange={(e)=>{this.onValueChange(e)}}/>
						    	<div className="input-group-addon">元</div>
						    </div>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品库存</label>
	    				<div className="col-md-3">
	    					<div className="input-group">
						    	<input type="number" 
						    		className="form-control" 
						    		placeholder="请输入商品库存数量"
						    		name="stock"
						    		value={this.state.stock}
    								onChange={(e)=>{this.onValueChange(e)}}/>
						    	<div className="input-group-addon">件</div>
						    </div>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品图片</label>
	    				<div className="col-md-offset-2 col-md-10 fileupload-con">
	    					<FileUploader onSuccess={(res)=>{this.uploadSuccess(res)}}
	    						onError={(error)=>{this.uploadError(error)}}/>
						</div>
						<div className="col-md-offset-2 col-md-10">
							{
								this.state.subImages.length ? this.state.subImages.map(
									(image,index) => (
										<div className="img-con" key={index}>
											<img className="img" src={image.url}/>
											<i className="fa fa-close" index={index}
												onClick={(e) =>{this.deleteUploadImage(e)}}></i>
										</div>)
								):(<div>请上传图片</div>)
							}
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品描述</label>
	    				<div className="col-md-10">
	    					<RichEditor
	    						detail = {this.state.detail} 
	    						defaultDetail = {this.state.defaultDetail} 
	    						onValueChange={(value) => this.getRichEditorValue(value)}/>
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
		);
	}
}

export default ProductSave;
