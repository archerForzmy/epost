import React from 'react';
import Simditor from 'simditor';

import 'simditor/styles/simditor.scss';
import './index.scss';

import MMUtil from 'util/mm.js';
const _mm  = new MMUtil();

//富文本编辑
class RichEditor extends React.Component{
	constructor(props){
		super(props);
	}
	//组件初始化
	componentDidMount(){
		//加载富文本编辑器
		this.loadEditor();
	}
	//当props改变时候回调
    componentWillReceiveProps(nextProps){
    	//当数据发生变化采取更新
    	if(this.props.defaultDetail!== nextProps.defaultDetail){
    		this.simditor.setValue(nextProps.defaultDetail);
    	}
    }
	//加载富文本编辑器
	loadEditor(){
		//获取编辑器对象
		let element = this.refs['textarea'];
		//转换成jquery对象
		this.simditor = new Simditor({
            textarea: $(element),
            defaultValue: this.props.placeholder || '请输入内容',
            upload:{
                url             : _mm.getServerUrl('/manage/product/richtext_img_upload.do'), //富文本上传文件的地址
                defaultImage    : '',
                fileKey         :'upload_file'    //表单name的名字
            }
        });
		//初始化富文本编辑器事件
		this.simditor.on('valuechanged', e => {
			//将插件内容传递给父容器
            this.props.onValueChange(this.simditor.getValue());
        })

	}	
	render(){
		return (
			<div className="rich-editor">
                <textarea ref="textarea"></textarea>
            </div>
		);
	}
}

export default RichEditor;