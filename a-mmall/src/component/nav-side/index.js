import React from 'react';
import {Link,NavLink} from 'react-router-dom';

class NavSide extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className="navbar-default navbar-side">
            	<div className="sidebar-collapse">
                	<ul className="nav">
               	    	<li>
                        	<NavLink exact activeClassName="active-menu" to="/">
                                <i className="fa fa-dashboard"></i>
                                <span>首页</span>
                            </NavLink>
                    	</li>
                    	<li className="active">
                        	<NavLink to="/seckill">
                                <i className="fa fa-bolt"></i>活动
                                <span class="fa arrow"></span>
                            </NavLink>
                            <ul class="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/seckill" activeClassName="active-menu">秒杀管理</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/seckill-credit" activeClassName="active-menu">积分兑换</NavLink>
                                </li>
                            </ul>
                    	</li>
						<li className="active">
                            <NavLink to="/product">
                                <i class="fa fa-cart-plus"></i>商品
                                <span class="fa arrow"></span>
                            </NavLink>
                            <ul class="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/product" activeClassName="active-menu">商品管理</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/product-category" activeClassName="active-menu">品类管理</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="active">
                            <NavLink to="/propaganda">
                                <i className="fa fa-image"></i>宣传
                                <span class="fa arrow"></span>
                            </NavLink>
                            <ul class="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/propaganda" activeClassName="active-menu">轮播管理</NavLink>
                                </li>
                            </ul>
                        </li>
                    	<li className="active">
                        	<NavLink to="/user">
                                <i className="fa fa-user"></i>用户
                                <span class="fa arrow"></span>
                            </NavLink>
                            <ul class="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/user" activeClassName="active-menu">用户管理</NavLink>
                                </li>
                            </ul>
                    	</li>
                   	 	<li className="active">
                        	<NavLink to="/order">
                                <i className="fa fa-edit"></i>订单
                                <span class="fa arrow"></span>
                            </NavLink>
                            <ul class="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/order" activeClassName="active-menu">订单管理</NavLink>
                                </li>
                            </ul>
                    	</li>
                	</ul>
            	</div>
        	</div>
		);
	}
}

export default NavSide;