import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
//插件引用
import Layout from 'component/layout/index.js';
//页面引用
import Home from 'page/home/index.js';
import UserList from 'page/user/index.js';
import ProductList from 'page/product/list/index.js';
import ProductSave from 'page/product/save/index.js';
import ProductDetail from 'page/product/detail/index.js';
import ProductCategory from 'page/product/category/index.js';
import ProductCategorySave from 'page/product/category/add.js';
import OrderList from 'page/order/index.js';
import OrderDetail from 'page/order/detail.js';
import PropagandaList from 'page/propaganda/index.js';
import PropagandaSave from 'page/propaganda/save.js';
import SeckillList from 'page/seckill/list/index.js';
import SeckillSave from 'page/seckill/save/index.js';
import SeckillCredit from 'page/seckill/credit/index.js';
import SeckillCreditSave from 'page/seckill/credit-save/index.js';
import Login from 'page/login/index.js';
import ErrorPage from 'page/error/index.js';
//Redirect跳转标签
//Router只能有一个节点
class App extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<Router>
				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="/" render={props=>(
						<Layout>
							<Switch>
								<Route exact path="/" component={Home}/>

								<Route path="/seckill/index" component={SeckillList}/>
								<Route path="/seckill/save/:sid?" component={SeckillSave}/>
								<Redirect exact from="/seckill" to="/seckill/index"/>

								<Route path="/seckill-credit/index" component={SeckillCredit}/>
								<Route path="/seckill-credit/save/:cid?" component={SeckillCreditSave}/>
								<Redirect exact from="/seckill-credit" to="/seckill-credit/index"/>

								<Route path="/product/index" component={ProductList}/>
								<Route path="/product/save/:pid?" component={ProductSave}/>
								<Route path="/product/detail/:pid" component={ProductDetail}/>
								<Redirect exact from="/product" to="/product/index"/>
								
								<Route path="/product-category/index/:categoryId?" component={ProductCategory}/>
								<Route path="/product-category/save" component={ProductCategorySave}/>
								<Redirect exact from="/product-category" to="/product-category/index"/>
								
								<Route path="/propaganda/index" component={PropagandaList}/>
								<Route path="/propaganda/save/:propagandaId?" component={PropagandaSave}/>
								<Redirect exact from="/propaganda" to="/propaganda/index"/>

								<Route path="/user/index" component={UserList}/>
								<Redirect exact from="/user" to="/user/index"/>
								
								<Route path="/order/index" component={OrderList}/>
								<Route path="/order/detail/:orderNumber" component={OrderDetail}/>
								<Redirect exact from="/order" to="/order/index"/>

								<Route component={ErrorPage}/>
							</Switch>
						</Layout>
					)}/>
				</Switch>
			</Router>
		);
	}
}

//引用多个组件需要<div></div>包裹
ReactDOM.render(
	<App/>,
    document.getElementById('app')
)