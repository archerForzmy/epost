package com.epost.dao;

import com.epost.pojo.Shipping;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ShippingMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Shipping record);

    int insertSelective(Shipping record);

    Shipping selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Shipping record);

    int updateByPrimaryKey(Shipping record);

    //删除用户的收货地址
    int deleteByShippingIdUserId(@Param("userId")Integer userId, @Param("shippingId") Integer shippingId);
    //更新用户的收货地址
    int updateByShipping(Shipping record);
    //选中默认收货地址
    Shipping selectByShippingIdUserId(@Param("userId")Integer userId,@Param("shippingId") Integer shippingId);
    //加载用户的所有收货地址
    List<Shipping> selectByUserId(@Param("userId")Integer userId);
}