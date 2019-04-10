import React from 'react';
import './select.scss';

import MMUtil from 'util/mm.js';
import Product from 'service/product.js';

const _mm  = new MMUtil();
const product = new Product();

// 品类下拉选择组件(二级联动)
class CategorySelector extends React.Component{
    constructor(props){
		super(props);
        this.state={
            categoryList:[],
            categoryId:0,
            subCategoryList:[],
            subCategoryId:0,
        };
	}

    //组件初始化
    componentDidMount(){
        this.loadCategoryList();  
    }

    //当props改变时候回调
    componentWillReceiveProps(nextProps){
        //判断是否真的改变了
        let categoryId = this.props.categoryId !== nextProps.categoryId,
            parentCategoryId = this.props.parentCategoryId !== nextProps.parentCategoryId;
        //如果数据没变化就不更新缓存
        if(!categoryId && !parentCategoryId){
            return ;
        }
        //如果只有一级分类
        if(nextProps.parentCategoryId === 0){
            this.setState({
                categoryId:nextProps.categoryId,
                subCategoryId:0
            });
        }else{
            this.setState({
                categoryId:nextProps.parentCategoryId,
                subCategoryId:nextProps.categoryId
            },()=>{
                //一级分类改变了要重新加载耳机列表
                parentCategoryId && this.loadSubCategoryList();
            });
        }
    }

    //加载一级分类列表
    loadCategoryList(){
        product.getCategoryList().then(res =>{
            this.setState({
                categoryList:res,
            });
        },errMsg =>{
            _mm.errorTips(errMsg);
        })
    }

    //加载二级分类列表
    loadSubCategoryList(){
        product.getCategoryList(this.state.categoryId).then(res =>{
            this.setState({
                subCategoryList:res,
            });
        },errMsg =>{
            _mm.errorTips(errMsg);
        })
    }

    //当一级列表选择了
    onCategoryIdChange(e){
        let newCategoryId = e.target.value || 0;
        this.setState({
            categoryId:newCategoryId,
            subCategoryList:[],
            subCategoryId:0,
        },() =>{
            //更新二级列表
            this.loadSubCategoryList();
            this.onPropsCategoryChange();
        })
    }
    
    //当二级列表选择了
    onSubCategoryIdChange(e){
        let newSubCategoryId = e.target.value || 0;
        this.setState({
            subCategoryId:newSubCategoryId,
        },() =>{
            this.onPropsCategoryChange();
        })
    }

    //传给父组件选中的categoryid
    onPropsCategoryChange(){
        let categoryChangable = typeof this.props.onCategoryChangable === 'function';
        if(this.state.subCategoryId){
            categoryChangable && this.props.onCategoryChangable(this.state.subCategoryId,this.state.categoryId);
        }else{
            categoryChangable && this.props.onCategoryChangable(this.state.categoryId,0);
        }
    }

    render() {
        return (
        	 <div className="col-md-5">
                <select className="form-control category-select" 
                    value={this.state.categoryId}
                    onChange={(e)=>{this.onCategoryIdChange(e)}}>
                    <option value="">请选择一级分类</option>
                    {
                        this.state.categoryList.map((category,index) => 
                            <option key={index} value={category.id}>{category.name}</option>)
                    }
                </select>
                {
                    this.state.subCategoryList.length ?  
                        (<select className="form-control category-select" 
                                value={this.state.subCategoryId}
                                onChange={(e)=>{this.onSubCategoryIdChange(e)}}>
                            <option value="">请选择二级分类</option>
                            {
                                this.state.subCategoryList.map((category,index) => 
                                    <option key={index} value={category.id}>{category.name}</option>)
                             }
                        </select>):null
                }
            </div>
        );        
    }
}

export default CategorySelector;