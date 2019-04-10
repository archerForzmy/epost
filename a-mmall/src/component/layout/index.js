import React from 'react';
import './theme.css';

import NavTop from 'component/nav-top/index.js';
import NavSide from 'component/nav-side/index.js';

//页面框架组件
class Layout extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div id="wrapper">
				<NavTop/>
				<NavSide/>
				{this.props.children}
			</div>
		);
	}
}

export default Layout;