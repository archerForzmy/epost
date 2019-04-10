package com.epost.dao;

import com.epost.pojo.Order;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrderMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Order record);

    int insertSelective(Order record);

    Order selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Order record);

    int updateByPrimaryKey(Order record);

    //获取用户的订单
    Order selectByUserIdAndOrderNo(@Param("userId")Integer userId, @Param("orderNo")Long orderNo);
    //获取订单
    Order selectByOrderNo(Long orderNo);
    //根据用户获取用户所有的订单
    List<Order> selectByUserId(Integer userId);
    //获取系统所有订单
    List<Order> selectAllOrder();
    //获取所有的订单
    Integer getOrderCount();

    //查询超时订单
    List<Order> selectOrderStatusByCreateTime(@Param("status") Integer status, @Param("date") String date);
    //取消订单
    int closeOrderByOrderId(Integer id);
}