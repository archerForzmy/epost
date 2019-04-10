package com.epost.service.impl;

import com.epost.common.ServerResponse;
import com.epost.dao.CategoryMapper;
import com.epost.pojo.Category;
import com.epost.service.ICategoryService;
import com.epost.vo.CategoryNodeVo;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;

@Service("iCategoryService")

@Slf4j
public class CategoryServiceImpl implements ICategoryService {
    //private Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
    @Resource
    private CategoryMapper categoryMapper;
    //添加分类
    @Override
    public ServerResponse<String> addCategory(String categoryName, Integer parentId) {
        if(parentId == null || StringUtils.isBlank(categoryName)){
            return ServerResponse.createByErrorMessage("添加品类参数错误");
        }

        Category category = new Category();
        category.setName(categoryName);
        category.setParentId(parentId);
        category.setStatus(true);//这个分类是可用的

        int rowCount = categoryMapper.insert(category);
        if(rowCount > 0){
            return ServerResponse.createBySuccess("添加品类成功");
        }
        return ServerResponse.createByErrorMessage("添加品类失败");
    }

    //修改分类名
    @Override
    public ServerResponse<String> updateCategoryName(Integer categoryId, String categoryName) {
        if(categoryId == null || StringUtils.isBlank(categoryName)){
            return ServerResponse.createByErrorMessage("更新品类参数错误");
        }
        Category category = new Category();
        category.setId(categoryId);
        category.setName(categoryName);

        int rowCount = categoryMapper.updateByPrimaryKeySelective(category);
        if(rowCount > 0){
            return ServerResponse.createBySuccess("更新品类名字成功");
        }
        return ServerResponse.createByErrorMessage("更新品类名字失败");
    }

    //根据分类id获取字分类列表
    @Override
    public ServerResponse<List<Category>> getChildrenParallelCategory(Integer categoryId) {
        List<Category> categoryList = categoryMapper.selectCategoryChildrenByParentId(categoryId);
        if(CollectionUtils.isEmpty(categoryList)){
            log.info("未找到当前分类的子分类");
        }
        return ServerResponse.createBySuccess(categoryList);
    }

    //获取所有的分类数据（递归）
    @Override
    public ServerResponse getCategoryList(){
        List<CategoryNodeVo> categoryNodeVos = Lists.newArrayList();
        List<Category> categoryList = categoryMapper.selectCategoryChildrenByParentId(0);
        for(Category category:categoryList){
            List<Category> categorySubList = categoryMapper.selectCategoryChildrenByParentId(category.getId());
            List<CategoryNodeVo> categorySubNodeVos = Lists.newArrayList();
            for(Category subCategory:categorySubList){
                categorySubNodeVos.add(assembleCategoryNodeVo(subCategory,null));
            }
            categoryNodeVos.add(assembleCategoryNodeVo(category,categorySubNodeVos));
        }
        return ServerResponse.createBySuccess(categoryNodeVos);
    }

    /**
     * 递归查询本节点的id及孩子节点的id
     * @param categoryId
     * @return
     */
    @Override
    public ServerResponse<List<Integer>> selectCategoryAndChildrenById(Integer categoryId) {
        Set<Category> categorySet = Sets.newHashSet();
        findChildCategory(categorySet,categoryId);

        List<Integer> categoryIdList = Lists.newArrayList();
        if(categoryId != null){
            for(Category categoryItem : categorySet){
                categoryIdList.add(categoryItem.getId());
            }
        }
        return ServerResponse.createBySuccess(categoryIdList);
    }

    //递归算法,算出子节点
    private Set<Category> findChildCategory(Set<Category> categorySet , Integer categoryId){
        Category category = categoryMapper.selectByPrimaryKey(categoryId);
        if(category != null){
            //相同的hashcode无法添加进入集合
            categorySet.add(category);
        }
        //查找子节点,递归算法一定要有一个退出的条件
        List<Category> categoryList = categoryMapper.selectCategoryChildrenByParentId(categoryId);
        for(Category categoryItem : categoryList){
            findChildCategory(categorySet,categoryItem.getId());
        }
        return categorySet;
    }

    private CategoryNodeVo assembleCategoryNodeVo(Category category,List<CategoryNodeVo> categoryNodeVoList){
        CategoryNodeVo categoryNodeVo = new CategoryNodeVo();
        categoryNodeVo.setId(category.getId());
        categoryNodeVo.setName(category.getName());
        categoryNodeVo.setCategoryNodeVoList(categoryNodeVoList);
        return categoryNodeVo;
    }
}
