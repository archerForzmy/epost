package com.epost.service;

import com.epost.common.ServerResponse;
import com.epost.pojo.Seckill;
import com.github.pagehelper.PageInfo;

public interface ISeckillService {
    ServerResponse saveOrUpdateSeckill(Seckill seckill);

    ServerResponse getSeckillList(int pageNum, int pageSize);

    ServerResponse searchSeckill(String seckillName,Integer seckillId,int pageNum, int pageSize);

    ServerResponse manageSeckillDetail(Integer seckillId);

    ServerResponse getSeckillDetail(Integer seckillId);

    ServerResponse getSeckillListByTime();

    ServerResponse seckill(Integer userId,Integer count, Integer seckill,String token);

    Seckill seckill(Integer seckillId);
}
