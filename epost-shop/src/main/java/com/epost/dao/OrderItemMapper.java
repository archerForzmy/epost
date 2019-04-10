package com.epost.dao;

import com.epost.pojo.OrderItem;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrderItemMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(OrderItem record);

    int insertSelective(OrderItem record);

    OrderItem selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(OrderItem record);

    int updateByPrimaryKey(OrderItem record);

    //获取用户订单的订单项
    List<OrderItem> getByOrderNoUserId(@Param("orderNo")Long orderNo, @Param("userId")Integer userId);
    //批量插入订单项
    void batchInsert(@Param("orderItemList") List<OrderItem> orderItemList);
    //根据订单号获取订单项
    List<OrderItem> getByOrderNo(@Param("orderNo")Long orderNo);
    //根据商品Id和用户Id查询订单项
    Integer getOrderByUserIdAndProductId(@Param("productId")Integer productId, @Param("userId")Integer userId);
}