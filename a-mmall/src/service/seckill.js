import MMUtil from 'util/mm.js';

const _mm = new MMUtil();

export default class Seckill{
    //获取积分兑换列表(分页加载,要区分是否带关键字)
    getCreditList(listParam){
        let url ='',
            data = {};
        if(listParam.listType==='list'){
            url = '/manage/credit/list.do';
            data.pageNum = listParam.pageNum;
        }else if(listParam.listType==='search'){
            url = '/manage/credit/search.do';
            data.pageNum = listParam.pageNum;
            data[listParam.searchType] = listParam.searchKeyword;
        }
        return _mm.request({
            url     : _mm.getServerUrl(url),
            method  : 'POST',
            data    :data
        });
    }

    //检查积分兑换编辑提交的内容
    checkCredit(creditInfo){
        let result ={
            status:true,
            msg:'验证通过'
        }

        if(typeof creditInfo.name!=='string'||creditInfo.name.length===0){
            return {
                status: false,
                msg: '活动不能为空'
            }
        }
        if(typeof creditInfo.start!=='string'||creditInfo.start.length===0){
            return {
                status: false,
                msg: '活动日期不能为空'
            }
        }
        if(typeof creditInfo.end!=='string'||creditInfo.end.length===0){
            return {
                status: false,
                msg: '活动日期不能为空'
            }
        }
        if(typeof creditInfo.price!=='number'||creditInfo.price<0){
            return {
                status: false,
                msg: '非法价格'
            }
        }
        if(typeof creditInfo.productId!=='number'||creditInfo.productId<0){
            return {
                status: false,
                msg: '非法商品'
            }
        }

        return result;
    }

    //保存积分兑换活动
    saveCredit(creditInfo){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/credit/save.do'),
            method  : 'POST',
            data    :creditInfo
        });
    }

    //获取积分兑换根据cid
    getCredit(cid){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/credit/detail.do'),
            method  : 'POST',
            data    :{
                creditId:cid || 0
            }
        });
    }

	//获取秒杀列表(分页加载,要区分是否带关键字)
    getSeckillList(listParam){

    	let url ='',
    		data = {};
    	if(listParam.listType==='list'){
    		url = '/manage/seckill/list.do';
    		data.pageNum = listParam.pageNum;
    	}else if(listParam.listType==='search'){
    		url = '/manage/seckill/search.do';
    		data.pageNum = listParam.pageNum;
    		data[listParam.searchType] = listParam.searchKeyword;
    	}
        return _mm.request({
            url     : _mm.getServerUrl(url),
            method  : 'POST',
            data 	:data
        });
    }

    //获取所有商品（在售）
    getProducts(){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/product/all.do'),
            method  : 'POST',
            
        });
    }
   

    //检查商品编辑提交的内容
    checkSeckill(seckillInfo){
    	let result ={
    		status:true,
    		msg:'验证通过'
    	}

    	if(typeof seckillInfo.name!=='string'||seckillInfo.name.length===0){
            return {
                status: false,
                msg: '活动不能为空'
            }
        }
        if(typeof seckillInfo.price!=='number'||seckillInfo.price<0){
            return {
                status: false,
                msg: '非法价格'
            }
        }
        if(typeof seckillInfo.stock!=='number'||seckillInfo.stock<0){
            return {
                status: false,
                msg: '非法库存'
            }
        }
        if(typeof seckillInfo.pid!=='number'||seckillInfo.pid<0){
            return {
                status: false,
                msg: '非法商品'
            }
        }

    	return result;
    }

    //保存秒杀活动
    saveSeckill(seckillInfo){
    	return _mm.request({
            url     : _mm.getServerUrl('/manage/seckill/save.do'),
            method  : 'POST',
            data 	:seckillInfo
        });
    }

    //获取秒杀详情根据sid
    getSeckill(sid){
    	return _mm.request({
            url     : _mm.getServerUrl('/manage/seckill/detail.do'),
            method  : 'POST',
            data 	:{
            	seckillId:sid || 0
            }
        });
    }
}