import React from 'react';
import {Link} from 'react-router-dom';
import MMUtil from 'util/mm.js';
import Statistic from 'service/statistic.js';
import User from 'service/user.js';

const _mm  = new MMUtil();
const user = new User();
const statistic  = new Statistic();

class NavTop extends React.Component{
	constructor(props){
		super(props);
        this.state={
            username:_mm.getStorage("userInfo").username,
            dateTime:'',
        };
	}
    //退出登录
    onLogout(e){
        user.logout().then(res => {
            //删除登陆数据
            _mm.removeStorage("userInfo");
            //跳转到登陆页面
            window.location.href = "/login";
        }, errMsg => {
            _mm.errorTips(errMsg);
        });
    }

    //加载系统时间
    componentDidMount(){
        let that = this;
        let mark = setInterval(function(){
            statistic.getSystemDate().then(res =>{
                that.setState({
                    dateTime:res
                });
            },errMsg =>{
                //取消定时器
                window.clearTimeout(mark);
            });
        },1000);
    }

	render(){
		return (
			<div className="navbar navbar-default top-navbar">
           	 	<div className="navbar-header">
                	<Link className="navbar-brand" to="/"><b>E</b>Post</Link>
            	</div>
            	<ul className="nav navbar-top-links navbar-right">
                    <li className="dropdown">
                        <a className="dropdown-toggle" href="javascript:;">
                            <i className="fa fa-clock-o fa-fw"></i> 
                            <span>{this.state.dateTime}</span>
                        </a>
                    </li>
                	<li className="dropdown">
                    	<a className="dropdown-toggle" href="javascript:;">
                        	<i className="fa fa-user fa-fw"></i> 
                            {
                                this.state.username
                                    ?<span>欢迎{this.state.username}</span>
                                    :<span>欢迎你</span>
                            }
                            <i className="fa fa-caret-down"></i>
                    	</a>
                    	<ul className="dropdown-menu dropdown-user">
                        	<li>
                                <a onClick={(e)=>{this.onLogout(e)}}>
                                    <i className="fa fa-sign-out fa-fw"></i> 
                                    <span>退出登录</span>
                                </a>
                        	</li>
                    	</ul>
                	</li>
            	</ul>
        	</div>
		);
	}
}

export default NavTop;