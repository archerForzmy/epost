import React from 'react';
import FileUpload  from './FileUpload.js';
import MMUtil from 'util/mm.js';
const _mm  = new MMUtil();
//文件上传插件
class FileUploader extends React.Component{
    constructor(props){
		super(props);
        this.state={
           
        };
	}
	render(){
		/*set properties*/
		const options={
			baseUrl:_mm.getServerUrl('/manage/product/upload.do'), //fastdfs地址
			fileFieldName:'upload_file',		//表单name的名字
			dataType:'json',
			chooseAndUpload:true,    //选择图片就自动上传
			withCredentials:true,		//跨域相关
			uploadSuccess:(res)=>{
				this.props.onSuccess(res.data);
			},
			uploadError:(err) => {
				this.props.onError(err.message||'操作失败');
			}
		}
		/*Use FileUpload with options*/
		/*Set two dom with ref*/
		return (
			<FileUpload options={options}>
				<button className="btn btn-xs btn-default" ref="chooseAndUpload">请选择图片</button>
			</FileUpload>
		)	        
	}
}
export default FileUploader;

