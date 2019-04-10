import React from 'react';
import {Link,NavLink} from 'react-router-dom';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import DatetimePicker    from 'component/datetime-picker/index.js';
import SearchSelect    from 'component/search-select/index.js';

import MMUtil from 'util/mm.js';
import Seckill from 'service/seckill.js';

const _mm  = new MMUtil();
const seckill = new Seckill();

class SeckillCreditSave extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id:this.props.match.params.cid,  //获取url参数
			name:'',		//活动名称
			price:0,		//秒杀价格
			stock:0,		//库存
			pid:0,			//秒杀商品
			start:'',		//开始时间
			end:'',			//结束时间
			products:[]		//待选的商品列表
		};
	}
	//组件初始化
	componentDidMount(){
		//加载商品
		this.loadProducts();
		//加载积分详情
		this.loadCredit();
	}

	//加载所有商品
	loadProducts(){
		seckill.getProducts().then(res=>{
			let keyValue =  res.map((product) =>{
				return {
					id:product.id,
					value:product.name
				}
			});
			this.setState({
				products:keyValue
			});
		},errMsg =>{
			_mm.errorTips(errMsg);
		})
	}

	//加载积分兑换详情
	loadCredit(){
		if(this.state.id){
			seckill.getCredit(this.state.id).then(res=>{
				//这里可能日期转换
				this.setState(res);
			},errMsg=>{
				_mm.errorTips(errMsg);
			})
		}
	}

	//选择商品下拉列表
	onSelectValueChange(value){
		this.setState({
			pid:value
		});
	}

	//积分价，活动名称
	onValueChange(e){
		let value = e.target.value.trim(),
			name = e.target.name;
		this.setState({
			[name]:value
		});
	}

	//更新日期
	onDateValueChange(value,type){
		this.setState({
			[type]:value
		});
	}

	//商品更新或者新增
	onSubmit(e){
		let creditItem = {
			name:this.state.name,		//活动名称
			price:this.state.price,		//活动积分
			pid:this.state.pid,			//活动商品
			start:this.state.start,		//开始时间
			end:this.state.end,			//结束时间
		}
		//设置id
		if(this.state.id){
			creditItem.id = this.state.id;
		}
		//校验提交上去的内容
		let checkResult = seckill.checkCredit(creditItem);
		if(checkResult.status){
			seckill.saveCredit(creditItem).then((res) =>{
				_mm.successTips(res);
				//跳转到商品列表页
				this.props.history.push('/seckill-credit/index');
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
				<PageTitle pageTitle="编辑活动"/>
                <div className="form-horizontal">
  					<div className="form-group">
    					<label className="col-md-2 control-label">活动名称</label>
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
    					<label className="col-md-2 control-label">积分价格</label>
	    				<div className="col-md-3">
	    					<div className="input-group">
						    	<input type="number" 
						    		className="form-control" 
						    		placeholder="请输入积分价"
						    		name="price"
						    		value={this.state.price}
    								onChange={(e)=>{this.onValueChange(e)}}/>
						    	<div className="input-group-addon">分</div>
						    </div>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">库存</label>
	    				<div className="col-md-3">
	    					<div className="input-group">
						    	<input type="number" 
						    		className="form-control" 
						    		placeholder="请输入库存"
						    		name="stock"
						    		value={this.state.stock}
    								onChange={(e)=>{this.onValueChange(e)}}/>
						    	<div className="input-group-addon">件</div>
						    </div>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">活动商品</label>
	    				<SearchSelect dataList={this.state.products}
	    					id={this.state.pid}
	    					onSelectValueChange = {(value)=>{this.onSelectValueChange(value)}}/>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">活动开始</label>
	    				<DatetimePicker dateTime={this.state.start} 
	    					datetype="start"
	    					dateId="datetimepicker_start"
	    					onDateValueChange={(value,type)=>{this.onDateValueChange(value,type)}}/>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">活动结束</label>
	    				<DatetimePicker dateTime={this.state.end} 
	    					datetype="end"
	    					dateId="datetimepicker_end"
	    					onDateValueChange={(value,type)=>{this.onDateValueChange(value,type)}}/>
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

export default SeckillCreditSave;
