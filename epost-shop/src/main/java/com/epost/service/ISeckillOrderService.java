package com.epost.service;

import com.epost.common.ServerResponse;
import com.epost.pojo.SeckillOrder;

public interface ISeckillOrderService {
    ServerResponse getSeckillOrderDetail(Integer userId, Integer seckillId);

    ServerResponse createOrder(Integer userId, Integer seckillId,Integer shippingId);

    SeckillOrder seckillByUser(Integer userId, Integer seckillId);

    int insertSeckillOrder(SeckillOrder seckillOrder);
}
