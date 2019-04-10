import React from 'react';
import './index.scss';
import MMUtil from 'util/mm.js';
import User from 'service/user.js';

const _mm  = new MMUtil();
const user = new User();

class Login extends React.Component{
	constructor(props){
		super(props);
		this.state =  {
            username : '',
            password : '',
            redirect : _mm.getUrlParam('redirect') || '/' //获取登录之后要跳转的页面
        }
	}

	componentWillMount(){
    	//设置页面标题
        document.title = '登录' || 'EPost'
    }

	// 输入框内容变化时，更新state中的字段
    onInputChange(e){
        let inputValue  = e.target.value,
            inputName   = e.target.name;
        this.setState({
            [inputName] : inputValue
        });
    }

    //用户登录
    onSubmit(e){
    	let userInfo={
    		username:this.state.username,
    		password:this.state.password
    	} 
    	//验证提交数据合法性
    	let checkResult = user.checkLoginInfo(userInfo);
    	if(checkResult.status){
    		//开始登录
    		user.login(userInfo).then((res)=>{
    			//将登陆信息保存到本地
    			_mm.setStorage("userInfo",res);
    			//添加历史记录（登录之后要跳转的页面）
    			this.props.history.push(this.state.redirect);
    		}, 
    		(err) => {
    			_mm.errorTips(err);
    		});
    	}else{
			_mm.errorTips(checkResult.msg);
    	}
    	
    }

    //键盘事件
    onInputKeyUp(e){

    	if(e.keyCode === 13){
    		this.onSubmit();
    	}	
    }

	render(){
		return (
				<div className="col-md-4 col-md-offset-4">
					<div className="panel panel-default login-default">
  						<div className="panel-heading">欢迎登录 - EPost管理系统</div>
  						<div className="panel-body">
    						<div>
  								<div className="form-group">
    								<input type="email" 
    									name="username"
    									className="form-control" 
    									placeholder="请输入用户名"
    									onKeyUp={e => this.onInputKeyUp(e)}
    									onChange={e => this.onInputChange(e)}/>
  								</div>
  								<div className="form-group">
    								<input type="password" 
    									name="password"
    									className="form-control" 
    									placeholder="请输入密码"
    									onKeyUp={e => this.onInputKeyUp(e)}
    									onChange={e => this.onInputChange(e)}/>
  								</div>
  								<button
  									className="btn btn-block btn-primary"
  									onClick={(e) => {this.onSubmit(e)}}>登录</button>
							</div>
  						</div>
					</div>
				</div>
		);
	}
}

export default Login;