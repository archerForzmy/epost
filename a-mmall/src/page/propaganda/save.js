import React from 'react';
import {Link,NavLink} from 'react-router-dom';

import './save.scss';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import FileUploader from 'component/file-upload/index.js';

import MMUtil from 'util/mm.js';
import Propaganda from 'service/propaganda.js';

const _mm  = new MMUtil();
const propaganda = new Propaganda();

class PropagandaSave extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id:this.props.match.params.propagandaId,  //获取url参数
			name:'',
			image:'',
			url:'',
			mUrl:'',
			sort:0
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadPropaganda();
	}

	//加载广告详情
	loadPropaganda(){
		if(this.state.id){
			propaganda.getPropaganda(this.state.id).then(res=>{
				res.imgUrl = res.imageHost+res.image;
				this.setState(res);
			},errMsg=>{
				_mm.errorTips(errMsg);
			})
		}
	}

	//图片上传成功
	uploadSuccess(res){
		this.setState({
			image:res.uri,
			imgUrl:res.url
		})
	}

	//图片上传失败
	uploadError(error){
		_mm.errorTips(error);
	}

	//删除上传好的图片
	deleteUploadImage(e){
		this.setState({
			image:'',
			imgUrl:''
		})
	}

	//广告字段
	onValueChange(e){
		let value = e.target.value.trim(),
			name = e.target.name;
		this.setState({
			[name]:value
		});
	}

	//广告更新或者新增
	onSubmit(e){
		let propagandaItem = {
			name:this.state.name,
			image:this.state.image,
			url:this.state.url,
			mUrl:this.state.mUrl,
			sort:this.state.sort
		}
		//设置id
		if(this.state.id){
			propagandaItem.id = this.state.id;
		}
		//校验提交上去的内容
		let checkResult = propaganda.checkPropaganda(propagandaItem);
		if(checkResult.status){
			propaganda.savePropaganda(propagandaItem).then((res) =>{
				_mm.successTips(res);
				//跳转到商品列表页
				this.props.history.push('/propaganda/index');
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
				<PageTitle pageTitle="编辑广告"/>
                <div className="form-horizontal">
  					<div className="form-group">
    					<label className="col-md-2 control-label">广告名称</label>
    					<div className="col-md-5">
    						<input type="text" 
    							className="form-control" 
    							placeholder="请输入广告名称"
    							name="name"
    							value={this.state.name}
    							onChange={(e)=>{this.onValueChange(e)}}/>
    					</div>
  					</div>
  					<div className="form-group">
    					<label className="col-md-2 control-label">PC链接</label>
	    				<div className="col-md-10">
						    <input type="text" 
						    	className="form-control" 
						    	placeholder="请输入广告链接"
						    	name="url"
						    	value={this.state.url}
    							onChange={(e)=>{this.onValueChange(e)}}/>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">Mobile链接</label>
	    				<div className="col-md-10">
						    <input type="text" 
						    	className="form-control" 
						    	placeholder="请输入广告链接"
						    	name="mUrl"
						    	value={this.state.mUrl}
    							onChange={(e)=>{this.onValueChange(e)}}/>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">排序</label>
	    				<div className="col-md-10">
						    <input type="number" 
						    	className="form-control" 
						    	placeholder="请输入排序编号"
						    	name="sort"
						    	value={this.state.sort}
    							onChange={(e)=>{this.onValueChange(e)}}/>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">广告图片</label>
	    				<div className="col-md-offset-2 col-md-10 fileupload-con">
	    					<FileUploader onSuccess={(res)=>{this.uploadSuccess(res)}}
	    						onError={(error)=>{this.uploadError(error)}}/>
						</div>
						<div className="col-md-offset-2 col-md-10">
							{
								this.state.imgUrl ? (
									<div className="img-con">
										<img className="img" src={this.state.imgUrl}/>
										<i className="fa fa-close"
										onClick={(e) =>{this.deleteUploadImage(e)}}></i>
									</div>):(<div>没有上传图片</div>)
							}
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

export default PropagandaSave;
