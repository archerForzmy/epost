import MMUtil from 'util/mm.js';

const _mm = new MMUtil();

export default class Propaganda{

	//获取广告列表(分页加载,要区分是否带关键字)
    getPropagandaList(listParam){

    	let url ='',
    		data = {};
    	if(listParam.listType==='list'){
    		url = '/manage/propaganda/list.do';
    		data.pageNum = listParam.pageNum;
    	}else if(listParam.listType==='search'){
    		url = '/manage/propaganda/search.do';
    		data.pageNum = listParam.pageNum;
    		data.propagandaName = listParam.propagandaName;
    	}
        return _mm.request({
            url     : _mm.getServerUrl(url),
            method  : 'POST',
            data 	:data
        });
    }
    
    //获取广告详细信息
    getPropaganda(propagandaId){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/propaganda/detail.do'),
            method  : 'POST',
            data    :{
                propagandaId:propagandaId
            }
        });
    }


    //保存广告
    savePropaganda(propagandaInfo){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/propaganda/save.do'),
            method  : 'POST',
            data    :propagandaInfo
        });
    }

    //检查商品编辑提交的内容
    checkPropaganda(propagandaInfo){
        let result ={
            status:true,
            msg:'验证通过'
        }

        if(typeof propagandaInfo.name!=='string'||propagandaInfo.name.length===0){
            return {
                status: false,
                msg: '广告名不能为空'
            }
        }
        if(typeof propagandaInfo.url!=='string'||propagandaInfo.url.length===0){
            return {
                status: false,
                msg: '广告链接不能为空'
            }
        }
        if(typeof propagandaInfo.mUrl!=='string'||propagandaInfo.mUrl.length===0){
            return {
                status: false,
                msg: '广告链接不能为空'
            }
        }
        if(typeof propagandaInfo.image!=='string'||propagandaInfo.image.length===0){
            return {
                status: false,
                msg: '广告图片不能为空'
            }
        }
       

        return result;
    }

}