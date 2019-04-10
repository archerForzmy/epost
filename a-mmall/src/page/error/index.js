import React from 'react';
import {Link,NavLink} from 'react-router-dom';
//引入标题组件
import PageTitle    from 'component/page-title/index.js';

class Error extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			
		};
	}
	//组件初始化
	componentDidMount(){
		
	}

	render(){
		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="错误"/>
                <div className="row">
					<div className="col-md-12">
						<span>错误路径</span>
						<Link to="/">返回首页</Link>
					</div>
				</div>
			</div>		
		);
	}
}

export default Error;