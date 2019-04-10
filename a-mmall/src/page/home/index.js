import React from 'react';
import './index.scss';
import {Link,NavLink} from 'react-router-dom';
//引入标题组件
import PageTitle    from 'component/page-title/index.js';
import MMUtil from 'util/mm.js';
import Statistic from 'service/statistic.js';

const _mm  = new MMUtil();
const statistic  = new Statistic();

class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			userCount:'-',
			productCount:'-',
			orderCount:'-',
			seckillCount:'-'
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadCount();
	}
	//加载首页数据
	loadCount(){
		statistic.getHomeCount().then(res =>{
			this.setState(res);
		},errMsg =>{
			_mm.errorTips(errMsg);
		});
	}
	render(){
		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="首页"/>
                <div className="row">
                	<div className="col-md-4">
                        <Link to="/user" className="color-box brown">
                        	<p className="count">{this.state.userCount}</p>
                        	<p className="desc">
                        		<i className="fa fa-user"></i>
                        		<span>用户总数</span>
                        	</p>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/product" className="color-box blue">
                        	<p className="count">{this.state.productCount}</p>
                        	<p className="desc">
                        		<i className="fa fa-cart-plus"></i>
                        		<span>商品总数</span>
                        	</p>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/order" className="color-box green">
                        	<p className="count">{this.state.orderCount}</p>
                        	<p className="desc">
                        		<i className="fa fa-edit"></i>
                        		<span>订单总数</span>
                        	</p>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/seckill" className="color-box red">
                        	<p className="count">{this.state.seckillCount}</p>
                        	<p className="desc">
                        		<i className="fa fa-bolt"></i>
                        		<span>秒杀总数</span>
                        	</p>
                        </Link>
                    </div>
                </div>
			</div>
		);
	}
}

export default Home;