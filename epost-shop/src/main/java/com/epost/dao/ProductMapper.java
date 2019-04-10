package com.epost.dao;

import com.epost.pojo.Order;
import com.epost.pojo.Product;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Product record);

    int insertSelective(Product record);

    Product selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Product record);

    int updateByPrimaryKey(Product record);

    //获取商品列表
    List<Product> selectList();
    //获取带条件的商品列表
    List<Product> selectByNameAndProductId(@Param("productName")String productName, @Param("productId") Integer productId);
    //根据名字，商品分类Id集合查询商品列表(分页)
    List<Product> selectByNameAndCategoryIds(@Param("productName")String productName,@Param("categoryIdList")List<Integer> categoryIdList);
    //获取所有上架商品
    List<Product> selectAllByStatus();
    //获取当前产品数
    Integer getProductCount();

    //这里一定要用Integer，因为int无法为NULL，考虑到很多商品已经删除的情况。
    Integer selectStockByProductId(Integer id);
    //查询销量
    Integer selectVolumeByProductId(Integer id);
}