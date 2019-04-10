package com.epost.service.impl;

import com.epost.common.ServerResponse;
import com.epost.dao.OrderMapper;
import com.epost.dao.ProductMapper;
import com.epost.dao.SeckillMapper;
import com.epost.dao.UserMapper;
import com.epost.service.IStatisticService;
import com.epost.vo.StatisticVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;

@Service("iStatisticService")
@Slf4j
public class StatisticServiceImpl implements IStatisticService {
    @Resource
    UserMapper userMapper;
    @Resource
    ProductMapper productMapper;
    @Resource
    OrderMapper orderMapper;
    @Resource
    SeckillMapper seckillMapper;

    @Override
    public ServerResponse getCount(){
        StatisticVo statisticVo = new StatisticVo();
        statisticVo.setUserCount(userMapper.getUserCount());
        statisticVo.setProductCount(productMapper.getProductCount());
        statisticVo.setSeckillCount(seckillMapper.getSeckillCount());
        statisticVo.setOrderCount(orderMapper.getOrderCount());
        return ServerResponse.createBySuccess(statisticVo);
    }
}
