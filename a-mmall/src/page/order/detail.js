import React from 'react';
import {Link,NavLink} from 'react-router-dom';

import './detail.scss';

//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import TableList    from 'component/table-list/index.js';

import MMUtil from 'util/mm.js';
import Order from 'service/order.js';

const _mm  = new MMUtil();
const order = new Order();

class OrderDetail extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id:this.props.match.params.orderNumber,  //获取url参数
			orderInfo:{
				shippingVo:{},
				orderItemVoList:[]
			},
			postNo:{

			}
		};
	}
	//组件初始化后
	componentDidMount(){
		this.loadOrder();
	}

	//加载商品详情
	loadOrder(){
		order.getOrder(this.state.id).then(res=>{	
			this.setState({
				orderInfo:res
			});
		},errMsg=>{
			_mm.errorTips(errMsg);
		})
	}

	//填充快递单号
	onValueChange(e){
		let value = e.target.value.trim(),
			name = e.target.name;
		this.setState({
			postNo:{
				[name]:value
			}
		});
	}


	//订单发货
	sendGoods(e){
		let posts = [];
		for(let i in this.state.postNo){
			posts.push(this.state.postNo[i]);
		}
		if(window.confirm("确认订单是否发货")){
			order.sendGood({
				orderNo:this.state.id,
				post:posts.map((obj)=>obj).join(",")
			}).then(res=>{	
				_mm.successTips("发货成功");
				this.loadOrder();
			},errMsg=>{
				_mm.errorTips(errMsg);
			})
		}
	}

	//退款
	refund(e){
		if(window.confirm("是否和买家协议好了")){
			order.refund(this.state.id).then(res=>{	
				_mm.successTips("退款成功");
				this.loadOrder();
			},errMsg=>{
				_mm.errorTips(errMsg);
			})
		}
	}

	render(){
		return (
				<div id="page-wrapper">
					<div className="modal fade" id="myModal" role="dialog" 
						aria-labelledby="myModalLabel" aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<button type="button" className="close" data-dismiss="modal" 
										aria-hidden="true">
										&times;
									</button>
									<h4 className="modal-title" id="myModalLabel">
										添加快递单号
									</h4>
								</div>
								<div className="modal-body">
        							{
        								this.state.orderInfo.orderItemVoList.map((product,index)=>{
											return (
												<div className="input-group" key={index}>
            										<span className="input-group-addon">
														<i className="glyphicon glyphicon-barcode"></i>
													</span>
            										<input type="number" className="form-control"
            											name={`${product.productId}`} 
            											placeholder={`${product.productName}的快递单号`}
            											onChange={(e)=>{this.onValueChange(e)}}/>
        										</div>
											);
										})
									}
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-default" 
										data-dismiss="modal">关闭
									</button>
									<button type="button" className="btn btn-primary" 
									onClick={(e)=>{this.sendGoods(e)}} data-dismiss="modal">
									提交发货
									</button>
								</div>
							</div>
						</div>
					</div>

				<PageTitle pageTitle="订单详情"/>
                <div className="form-horizontal">
  					<div className="form-group">
    					<label className="col-md-2 control-label">订单号</label>
    					<div className="col-md-5">
    						<p className="form-control-static">{this.state.orderInfo.orderNo}</p>
    					</div>
  					</div>
  					<div className="form-group">
    					<label className="col-md-2 control-label">创建时间</label>
	    				<div className="col-md-5">
						    <p className="form-control-static">{this.state.orderInfo.createTime}</p>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">收件人</label>
	    				<div className="col-md-5">
						    <p className="form-control-static">
						    	{this.state.orderInfo.shippingVo.receiverName}
						    	{this.state.orderInfo.shippingVo.receiverProvince}
						    	{this.state.orderInfo.shippingVo.receiverCity}
						    	{this.state.orderInfo.shippingVo.receiverAddress}
						    	{this.state.orderInfo.shippingVo.receiverMobile || this.state.orderInfo.shippingVo.receiverPhone}
						    </p>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">订单状态</label>
	    				<div className="col-md-5">
						    <p className="form-control-static">
						    	{this.state.orderInfo.statusDesc}
						    	{
						    		this.state.orderInfo.status === 20 ?
						    		<button className="btn btn-default btn-sm btn-send-goods"
						    			 data-toggle="modal" data-target="#myModal">立刻发货</button>
						    		:null
						    	}
						    	{
						    		this.state.orderInfo.status >= 20 ?
						    		<button className="btn btn-default btn-sm btn-send-goods"
						    			onClick={(e)=>{this.refund(e)}}>协议退款</button>
						    		:null
						    	}
						    </p>
						</div>
  					</div>  
  					<div className="form-group">
    					<label className="col-md-2 control-label">支付方式</label>
	    				<div className="col-md-5">
						    <p className="form-control-static">{this.state.orderInfo.paymentTypeDesc}</p>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">订单金额</label>
	    				<div className="col-md-5">
						    <p className="form-control-static">￥{this.state.orderInfo.payment}</p>
						</div>
  					</div> 
  					<div className="form-group">
    					<label className="col-md-2 control-label">商品列表</label>
	    				<div className="col-md-10">
						    <TableList tableHeads={['图片','信息','单价','数量','合计']}>
		                	{
		                		this.state.orderInfo.orderItemVoList.map((product,index)=>{
									return (
										<tr key={index}>
											<td>
												<img className="p-img" 
													src={`${this.state.orderInfo.imageHost}${product.productImage}`}/>
											</td>
											<td>{product.productName}</td>
											<td>￥{product.currentUnitPrice}</td>
											<td>{product.quantity}</td>
											<td>￥{product.totalPrice}</td>
										</tr>
									);
								})
		                	}
		                	</TableList>
						</div>
  					</div> 
				</div>
			</div>		
		);
	}
}

export default OrderDetail;
