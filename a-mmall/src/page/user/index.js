import React from 'react';
import {Link,NavLink} from 'react-router-dom';
//组件
import PageTitle    from 'component/page-title/index.js';
import Pagination    from 'component/pagination/index.js';

import MMUtil from 'util/mm.js';
import User from 'service/user.js';

const _mm  = new MMUtil();
const user = new User();

class UserList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			pageNum:1,
			list:[],
			fristLoading:true
		};
	}
	//组件初始化
	componentDidMount(){
		this.loadUserList();	
	}

	//加载用户列表
	loadUserList(){
		user.getUserList(this.state.pageNum).then(res=>{
			this.setState(res,() =>{
				this.setState({fristLoading:false});
			});
		},errMsg=>{
			this.setState({
				list:[]
			});
			_mm.errorTips(errMsg);
		});
	}

	//页码改变
	onPageNumChange(pageNum){
		this.setState({
			pageNum:pageNum
		},()=>{
			this.loadUserList();
		})
	}

	//枷锁或者解锁用户
	onlock(isLock,id){
		let lock = isLock == 1 ? 0 : 1;
		let confirmTip = isLock == 1 ? '确定解锁吗？' : '确定枷锁吗？';
		if(window.confirm(confirmTip)){
			user.onLock(lock,id).then(res=>{
				_mm.successTips(res);
				//重新加载页面
				this.loadUserList();
			},errMsg=>{
				_mm.errorTips(errMsg);
			});
		}	
	}

	//显示枷锁/解锁
	lock(isLock,id){
		return (
			isLock === 1 ? 
				(<button className="btn btn-xs btn-danger"
					onClick={(e)=>{this.onlock(isLock,id)}}>
					解锁
				</button>)
				:
				(<button className="btn btn-xs btn-primary"
					onClick={(e)=>{this.onlock(isLock,id)}}>
					加锁
				</button>)	
		);
	}

	render(){
		let listBody = this.state.list.map((user,index)=>{
			return (
				<tr key={index}>
					<td>{user.id}</td>
					<td>{user.username}</td>
					<td>{user.email}</td>
					<td>{user.phone}</td>
					<td>{new Date(user.createTime).toLocaleString()}</td>
					<td>{this.lock(user.lock,user.id)}</td>
				</tr>
			);
		});

		let errorBody = (
			<tr>
				<td colSpan="6" className="text-center">
					{this.state.fristLoading?'正在加载':'没有结果'}
				</td>
			</tr>
		);

		let tableBody = this.state.list.length > 0 ? listBody:errorBody;
		return (
			<div id="page-wrapper">
				<PageTitle pageTitle="用户列表"/>
                <div className="row">
					<div className="col-md-12">
						<table className="table table-striped table-bordered">
							<thead>
								<tr>
									<th>编号</th>
									<th>用户名</th>
									<th>邮箱</th>
									<th>电话</th>
									<th>注册时间</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								{tableBody}	
							</tbody>
						</table>
					</div>
				</div>
				<Pagination current={this.state.pageNum} 
					total={this.state.total} 
					onChange={(pageNum) => {this.onPageNumChange(pageNum)}}/>
			</div>		
		);
	}
}

export default UserList;
