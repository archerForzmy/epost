package com.epost.service.impl;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.dao.*;
import com.epost.pojo.*;
import com.epost.service.IProductService;
import com.epost.service.ISeckillOrderService;
import com.epost.service.ISeckillService;
import com.epost.util.*;
import com.epost.vo.SeckillDetaillVo;
import com.epost.vo.SeckillListVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service("iSeckillService")
public class SeckillServiceImpl implements ISeckillService {
    @Resource
    private SeckillMapper seckillMapper;
    @Resource
    private OrderMapper orderMapper;
    @Resource
    private OrderItemMapper orderItemMapper;

    @Autowired
    private IProductService iProductService;
    @Autowired
    private ISeckillOrderService iSeckillOrderService;

    //更新或者插入一个秒杀对象
    @Override
    public ServerResponse saveOrUpdateSeckill(Seckill seckill) {
        if(seckill != null) {
            if(seckill.getStart()==null||seckill.getEnd()==null){
                return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
            }else{
                if(seckill.getStart().getTime()>=seckill.getEnd().getTime()){
                    return  ServerResponse.createByErrorMessage("结束时间不能大于开始时间");
                }
                if(seckill.getStart().getTime()< new Date().getTime()){
                    return  ServerResponse.createByErrorMessage("活动已经开始了！！");
                }
            }
            //判断是更新还是添加商品
            if (seckill.getId() != null) {
                int rowCount = seckillMapper.updateByPrimaryKeySelective(seckill);
                if (rowCount > 0) {
                    // 删除缓存中的内容
                    RedisShardedPoolUtil.del("seckill_"+seckill.getId());
                    return ServerResponse.createBySuccess("更新秒杀活动成功");
                }
                return ServerResponse.createByErrorMessage("更新秒杀活动失败");
            } else {
                int rowCount = seckillMapper.insert(seckill);
                if (rowCount > 0) {
                    return ServerResponse.createBySuccess("新增秒杀活动成功");
                }
                return ServerResponse.createByErrorMessage("新增秒杀活动失败");
            }
        }
        return ServerResponse.createByErrorMessage("新增或更新秒杀活动参数不正确");
    }

    @Override
    public ServerResponse getSeckillList(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<Seckill> seckillList = seckillMapper.selectList();
        PageInfo pageResult = new PageInfo(seckillList);
        return ServerResponse.createBySuccess(pageResult);
    }

    @Override
    public ServerResponse searchSeckill(String seckillName,Integer seckillId,int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        if(StringUtils.isNotBlank(seckillName)){
            seckillName = new StringBuilder().append("%").append(seckillName).append("%").toString();
        }
        List<Seckill> seckillList = seckillMapper.selectByNameAndSeckillId(seckillName,seckillId);
        PageInfo pageResult = new PageInfo(seckillList);
        return ServerResponse.createBySuccess(pageResult);
    }

    @Override
    public ServerResponse manageSeckillDetail(Integer seckillId) {
        if(seckillId == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode()
                    ,ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        Seckill seckill = seckill(seckillId);
        if(seckill == null){
            return ServerResponse.createByErrorMessage("广告已下架或者删除");
        }
        return ServerResponse.createBySuccess(seckill);
    }

    //获取秒杀详情
    @Override
    public ServerResponse getSeckillDetail(Integer seckillId) {
        Seckill seckill = seckill(seckillId);
        if(seckill==null){
            return  ServerResponse.createByErrorMessage("活动不存在");
        }
        Product product = iProductService.product(seckill.getPid());
        if(product == null){
            return  ServerResponse.createByErrorMessage("商品不存在");
        }
        SeckillDetaillVo seckillDetaillVo = assembleSeckillDeatillVo(seckill,product);
        return ServerResponse.createBySuccess(seckillDetaillVo);
    }

    //按照时间顺序加载所有秒杀活动
    @Override
    public ServerResponse getSeckillListByTime() {
        List<Seckill> seckills =  seckillMapper.seckillCurrentList();
        //转换对象
        List<SeckillListVo> seckillListVoList =  Lists.newArrayList();
        for(Seckill seckill:seckills){
            Product product = iProductService.product(seckill.getPid());
            seckillListVoList.add(assembleSeckillListVo(seckill,product));
        }
        return ServerResponse.createBySuccess(seckillListVoList);
    }

    //秒杀方法（重点）
    @Override
    @Transactional
    public ServerResponse seckill(Integer userId,Integer count, Integer seckillId,String token) {
        //限流措施
        boolean limit =  accessLimit("limit_seckill"+seckillId,500,2);
        if(!limit){
            return ServerResponse.createByErrorMessage("当前秒杀人数太多请重试");
        }

        Seckill seckill = seckill(seckillId);
        Product product = iProductService.product(seckill.getPid());
        if(seckill!=null){
            if(seckill.getStock()<count){
                return  ServerResponse.createByErrorMessage("库存不足");
            }
            if(seckill.getEnd().getTime()<=new Date().getTime()){
                return  ServerResponse.createByErrorMessage("秒杀已经结束");
            }
            if(StringUtils.isEmpty(token)||!StringUtils.equals(token
                    ,MD5Util.MD5EncodeUtf8(seckill.getName()+seckill.getPid()))){
                return  ServerResponse.createByErrorMessage("非法请求");
            }
            SeckillOrder seckillOrder =  iSeckillOrderService.seckillByUser(userId,seckillId);
            if(seckillOrder!=null){
                return  ServerResponse.createByErrorMessage("重复秒杀");
            }
            //减少库存
            int rowcount = seckillMapper.reduceStock(count,seckillId);
            if(rowcount>0) {
                //生成订单项
                OrderItem orderItem =  createOrderItem(userId,count,seckill,product);
                //生成订单
                Order order = createOrder(userId,orderItem.getTotalPrice(),orderItem.getOrderNo());
                //生成秒杀订单
                seckillOrder = createSeckillOrder(userId,seckillId,orderItem.getOrderNo());
            }else{
                return  ServerResponse.createByErrorMessage("秒杀失败");
            }
        }
        return ServerResponse.createBySuccess(seckill);
    }

    //通过id查询出来商品
    public Seckill seckill(Integer seckillId){
        if(seckillId==null){
            return null;
        }
        Seckill seckill = null;
        //从缓存中取出数据
        String result = RedisShardedPoolUtil.get("seckill_"+seckillId);
        if(StringUtils.equals("非法活动",result)){
            return null;
        }else if(result ==null){
            seckill = seckillMapper.selectByPrimaryKey(seckillId);
            if(seckill==null){
                //没有这个缓存
                RedisShardedPoolUtil.set("seckill_" + seckillId, "非法活动");
                return null;
            }else {
                result = JsonUtil.obj2String(seckill);
                //保存数据到缓存
                RedisShardedPoolUtil.set("seckill_" + seckill.getId(), result);
            }
        }
        seckill = JsonUtil.string2Obj(result,Seckill.class);
        return seckill;
    }

    //限流方法
    private boolean accessLimit(String key, int limit, int time) {
        boolean result = true;
        if (RedisShardedPoolUtil.exists(key)) {
            long afterValue = RedisShardedPoolUtil.incr(key);
            if (afterValue > limit) {
                result = false;
            }
        } else {
            RedisShardedPoolUtil.incr(key);
            RedisShardedPoolUtil.expire(key, time);
        }
        return result;
    }

    //创建订单
    private Order createOrder(Integer userId, BigDecimal payment, Long orderNo){
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setStatus(Const.OrderStatusEnum.NO_PAY.getCode());
        order.setPostage(0);
        order.setPaymentType(Const.PaymentTypeEnum.ONLINE_PAY.getCode());
        order.setPayment(payment);
        order.setUserId(userId);
        order.setCreateTime(new Date());
        order.setUpdateTime(new Date());
        int rowCount = orderMapper.insertSelective(order);
        if (rowCount > 0) {
            return order;
        }
        return null;
    }

    //创建秒杀订单
    private SeckillOrder createSeckillOrder(Integer userId,Integer seckillId,Long orderNo){
        SeckillOrder seckillOrder = new SeckillOrder();
        seckillOrder.setOrderNo(orderNo);
        seckillOrder.setSeckillId(seckillId);
        seckillOrder.setUserId(userId);
        int rowCount = iSeckillOrderService.insertSeckillOrder(seckillOrder);
        if (rowCount > 0) {
            return seckillOrder;
        }
        return null;
    }
    //创建订单项
    private OrderItem createOrderItem(Integer userId,Integer count,Seckill seckill,Product product){
        OrderItem orderItem = new OrderItem();
        orderItem.setUserId(userId);
        orderItem.setOrderNo(generateOrderNo());
        orderItem.setProductId(seckill.getPid());
        orderItem.setProductName(seckill.getName());
        orderItem.setProductImage(product.getMainImage());
        orderItem.setCurrentUnitPrice(product.getPrice());
        orderItem.setTotalPrice(BigDecimalUtil.mul(seckill.getPrice().doubleValue(),count));
        orderItem.setQuantity(count);
        int rowCount = orderItemMapper.insert(orderItem);
        if (rowCount > 0) {
            return orderItem;
        }
        return null;
    }

    //生成随机订单号
    private Long generateOrderNo() {
        Long currentTime = System.currentTimeMillis();
        //100个人并发，下单，不会失败。数据库中是唯一索引。
        return currentTime + new Random().nextInt(100);
    }


    //将对象转成秒杀列表对象
    private SeckillListVo assembleSeckillListVo(Seckill seckill, Product product){
        SeckillListVo seckillListVo = new SeckillListVo();
        seckillListVo.setSeckillId(seckill.getId());
        seckillListVo.setSeckillName(seckill.getName());
        seckillListVo.setStart(seckill.getStart());
        seckillListVo.setEnd(seckill.getEnd());
        seckillListVo.setSeckillPrice(seckill.getPrice());
        seckillListVo.setPrice(product.getPrice());
        seckillListVo.setMainImage(product.getMainImage());
        seckillListVo.setNow(new Date());
        seckillListVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.epost.com/"));
        return seckillListVo;
    }

    //将秒杀对象转换成秒杀详情
    private SeckillDetaillVo assembleSeckillDeatillVo(Seckill seckill, Product product){
        SeckillDetaillVo seckillDetaillVo = new SeckillDetaillVo();
        seckillDetaillVo.setSeckillId(seckill.getId());
        seckillDetaillVo.setSeckillName(seckill.getName());
        seckillDetaillVo.setSeckillStock(seckill.getStock());
        seckillDetaillVo.setStart(seckill.getStart());
        seckillDetaillVo.setEnd(seckill.getEnd());
        seckillDetaillVo.setSeckillPrice(seckill.getPrice());
        seckillDetaillVo.setSubImages(product.getSubImages());
        seckillDetaillVo.setSubtitle(product.getSubtitle());
        seckillDetaillVo.setPrice(product.getPrice());
        seckillDetaillVo.setMainImage(product.getMainImage());
        seckillDetaillVo.setStatus(product.getStatus());
        seckillDetaillVo.setDetail(product.getDetail());
        seckillDetaillVo.setNow(new Date());
        //加密生成token（秒杀用的）
        seckillDetaillVo.setToken(MD5Util.MD5EncodeUtf8(seckill.getName()+product.getId()));
        seckillDetaillVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.epost.com/"));

        return seckillDetaillVo;
    }
}
