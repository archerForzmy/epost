package com.epost.dao;

import com.epost.pojo.Cart;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CartMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Cart record);

    int insertSelective(Cart record);

    Cart selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Cart record);

    int updateByPrimaryKey(Cart record);

    //获取用户所有的购物车
    List<Cart> selectCartByUserId(Integer userId);
    //获取用户是否有未勾选的购物车
    int selectCartProductCheckedStatusByUserId(Integer userId);
    //获取购物车中的商品项
    Cart selectCartByUserIdProductId(@Param("userId") Integer userId, @Param("productId")Integer productId);
    //删除购物车中商品数量
    int deleteByUserIdProductIds(@Param("userId") Integer userId,@Param("productIdList")List<String> productIdList);
    //勾选购物车方法
    int checkedOrUncheckedProduct(@Param("userId") Integer userId,@Param("productId")Integer productId,@Param("checked") Integer checked);
    //用户购物车数量
    int selectCartProductCount(@Param("userId") Integer userId);

    //获取用户已经勾线的购物车
    List<Cart> selectCheckedCartByUserId(Integer userId);


}