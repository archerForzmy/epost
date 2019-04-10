package com.epost.service.impl;

import com.epost.common.Const;
import com.epost.common.ServerResponse;
import com.epost.dao.*;
import com.epost.pojo.*;
import com.epost.service.IProductService;
import com.epost.service.ISeckillOrderService;
import com.epost.service.ISeckillService;
import com.epost.util.BigDecimalUtil;
import com.epost.util.JsonUtil;
import com.epost.util.PropertiesUtil;
import com.epost.util.RedisShardedPoolUtil;
import com.epost.vo.SeckillOrderVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.List;

@Service("iSeckillOrderService")
public class SeckillOrderServiceImpl implements ISeckillOrderService {
    @Resource
    SeckillOrderMapper seckillOrderMapper;
    @Resource
    OrderItemMapper orderItemMapper;
    @Resource
    OrderMapper orderMapper;

    @Autowired
    IProductService iProductService;
    @Autowired
    ISeckillService iSeckillService;

    //查询订单详情
    @Override
    public ServerResponse getSeckillOrderDetail(Integer userId, Integer seckillId) {
        if(seckillId == null){
            return  ServerResponse.createByErrorMessage("没有该活动");
        }
        SeckillOrder seckillOrder = seckillByUser(userId,seckillId);
        if(seckillOrder== null){
            return  ServerResponse.createByErrorMessage("订单不存在");
        }
        Seckill seckill = iSeckillService.seckill(seckillId);
        Product product = iProductService.product(seckill.getPid());
        List<OrderItem> orderItemList =  orderItemMapper.getByOrderNoUserId(seckillOrder.getOrderNo(),userId);
        //将秒杀订单转换一下
        return ServerResponse.createBySuccess(assembleSeckillOrderVo(seckill,product,orderItemList));
    }

    //给秒杀订单添加一个收货地址
    @Override
    public ServerResponse createOrder(Integer userId,Integer seckillId,Integer shippingId) {
        SeckillOrder seckillOrder = seckillByUser(userId,seckillId);
        Order order = orderMapper.selectByOrderNo(seckillOrder.getOrderNo());
        if(order==null){
            return ServerResponse.createByErrorMessage("订单不存在");
        }
        if(order.getStatus() == Const.OrderStatusEnum.CANCELED.getCode()){
            return ServerResponse.createByErrorMessage("订单已取消");
        }
        order.setShippingId(shippingId);
        orderMapper.updateByPrimaryKeySelective(order);
        return ServerResponse.createBySuccess(order);
    }

    //从缓存或者数据库中取出数据
    public SeckillOrder seckillByUser(Integer userId,Integer seckillId){
        if(seckillId==null){
            return null;
        }
        SeckillOrder seckillOrder = null;
        //从缓存中取出数据
        String result = RedisShardedPoolUtil.get("seckill_order_"+seckillId+userId);
        if(result ==null){
            seckillOrder = seckillOrderMapper.selectOrderByUserAndId(userId,seckillId);
            if(seckillOrder==null){
                return null;
            }else {
                result = JsonUtil.obj2String(seckillOrder);
                //保存数据到缓存
                RedisShardedPoolUtil.set("seckill_order_" + seckillId+userId, result);
            }
        }else {
            seckillOrder = JsonUtil.string2Obj(result, SeckillOrder.class);
        }
        return seckillOrder;
    }

    //从数据库里插入一个秒杀订单
    public int insertSeckillOrder(SeckillOrder seckillOrder){
        return seckillOrderMapper.insert(seckillOrder);
    }

    //将秒杀订单转换成前段对象
    private SeckillOrderVo assembleSeckillOrderVo(Seckill seckill,Product product,List<OrderItem> orderItemList){
        SeckillOrderVo seckillOrderVo = new SeckillOrderVo();
        seckillOrderVo.setSeckillId(seckill.getId());
        seckillOrderVo.setSeckillName(seckill.getName());
        seckillOrderVo.setCurrentUnitPrice(product.getPrice());
        seckillOrderVo.setCurrentUnitSeckillPrice(seckill.getPrice());
        seckillOrderVo.setProductImage(product.getMainImage());
        seckillOrderVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.epost.com/"));
        int quantity = 0;
        BigDecimal totalPrice = new BigDecimal(0);
        for(OrderItem orderItem:orderItemList){
            quantity += orderItem.getQuantity();
            totalPrice = BigDecimalUtil.add(totalPrice.doubleValue(),orderItem.getTotalPrice().doubleValue());
        }
        seckillOrderVo.setTotalPrice(totalPrice);
        seckillOrderVo.setQuantity(quantity);

        return  seckillOrderVo;
    }
}
