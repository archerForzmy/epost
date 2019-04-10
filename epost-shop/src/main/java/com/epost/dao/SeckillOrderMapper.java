package com.epost.dao;

import com.epost.pojo.SeckillOrder;
import org.apache.ibatis.annotations.Param;

public interface SeckillOrderMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SeckillOrder record);

    int insertSelective(SeckillOrder record);

    SeckillOrder selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SeckillOrder record);

    int updateByPrimaryKey(SeckillOrder record);

    //查询用户的订单
    SeckillOrder selectOrderByUserAndId(@Param("userId")Integer userId, @Param("seckillId")Integer seckillId);
    //查询订单是否存在
    Integer checkOrderByUserAndId(@Param("userId")Integer userId, @Param("seckillId")Integer seckillId);
    //根据用户和订单号查询秒杀订单
    SeckillOrder selectOrderByUserAndOrderNo(@Param("userId")Integer userId, @Param("orderNo")Long orderNo);
}