import React from 'react';

class PageTitle extends React.Component{
	constructor(props){
		super(props);
	}
    componentDidMount(){
    	//设置页面标题
        document.title = this.props.pageTitle || 'EPost'
    }
    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">{this.props.pageTitle}</h1>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default PageTitle;