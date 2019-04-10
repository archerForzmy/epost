package com.epost.dao;

import com.epost.pojo.Seckill;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface SeckillMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Seckill record);

    int insertSelective(Seckill record);

    Seckill selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Seckill record);

    int updateByPrimaryKey(Seckill record);

    //根据名称获取广告
    List<Seckill> selectByNameAndSeckillId(@Param("seckillName")String seckillName, @Param("seckillId")Integer seckillId);
    //获取广告列表
    List<Seckill> selectList();
    //获取秒杀活动个数
    Integer getSeckillCount();
    //按照顺序加载秒杀列表
    List<Seckill> seckillCurrentList();
    //减少库存
    int reduceStock(@Param("count")Integer count,@Param("seckillId")Integer seckillId);
}