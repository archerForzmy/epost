import MMUtil from 'util/mm.js';

const _mm = new MMUtil();

export default class Product{

	//获取商品列表(分页加载,要区分是否带关键字)
    getProductList(listParam){

    	let url ='',
    		data = {};
    	if(listParam.listType==='list'){
    		url = _mm.getServerUrl('/manage/product/list.do');
    		data.pageNum = listParam.pageNum;
    	}else if(listParam.listType==='search'){
    		url = _mm.getServerUrl('/manage/product/search.do');
    		data.pageNum = listParam.pageNum;
    		data[listParam.searchType] = listParam.searchKeyword;
    	}
        return _mm.request({
            url     : url,
            method  : 'POST',
            data 	:data
        });
    }
    //上下架
    setProductStatus(productInfo){
    	return _mm.request({
            url     : _mm.getServerUrl('/manage/product/set_sale_status.do'),
            method  : 'POST',
            data 	:productInfo
        });
    }

    //查询品类列表
    getCategoryList(categoryId){
    	return _mm.request({
            url     : _mm.getServerUrl('/manage/category/get_category.do'),
            method  : 'POST',
            data 	:{
            	categoryId:categoryId || 0
            }
        });
    }

    //添加品类
    saveCategory(category){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/category/add_category.do'),
            method  : 'POST',
            data    : category
        });
    }

    //更新分类名称
    updateCategoryName(category){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/category/set_category_name.do'),
            method  : 'POST',
            data    : category
        });
    }

    //检查商品编辑提交的内容
    checkProduct(productInfo){
    	let result ={
    		status:true,
    		msg:'验证通过'
    	}

    	if(typeof productInfo.name!=='string'||productInfo.name.length===0){
            return {
                status: false,
                msg: '商品名名不能为空'
            }
        }
        if(typeof productInfo.subtitle!=='string'||productInfo.subtitle.length===0){
            return {
                status: false,
                msg: '商品描述不能为空'
            }
        }
        if(typeof productInfo.price!=='number'||productInfo.price<0){
            return {
                status: false,
                msg: '非法价格'
            }
        }
        if(typeof productInfo.stock!=='number'||productInfo.stock<0){
            return {
                status: false,
                msg: '非法库存'
            }
        }
        if(typeof productInfo.categoryId!=='number'||productInfo.categoryId<0){
            return {
                status: false,
                msg: '非法品类'
            }
        }

    	return result;
    }

    //保存商品
    saveProduct(productInfo){
    	return _mm.request({
            url     : _mm.getServerUrl('/manage/product/save.do'),
            method  : 'POST',
            data 	:productInfo
        });
    }

    //获取商品详情根据pid
    getProduct(pid){
    	return _mm.request({
            url     : _mm.getServerUrl('/manage/product/detail.do'),
            method  : 'POST',
            data 	:{
            	productId:pid || 0
            }
        });
    }
}