package com.epost.service.impl;

import com.Kdniao.demo.trade.KdniaoTrackQueryAPI;
import com.alipay.api.AlipayResponse;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.alipay.demo.trade.config.Configs;
import com.alipay.demo.trade.model.ExtendParams;
import com.alipay.demo.trade.model.GoodsDetail;
import com.alipay.demo.trade.model.builder.AlipayTradePrecreateRequestBuilder;
import com.alipay.demo.trade.model.builder.AlipayTradeRefundRequestBuilder;
import com.alipay.demo.trade.model.result.AlipayF2FPrecreateResult;
import com.alipay.demo.trade.model.result.AlipayF2FRefundResult;
import com.alipay.demo.trade.service.AlipayTradeService;
import com.alipay.demo.trade.service.impl.AlipayTradeServiceImpl;
import com.alipay.demo.trade.utils.ZxingUtils;
import com.epost.common.Const;
import com.epost.common.ServerResponse;
import com.epost.dao.*;
import com.epost.pojo.*;
import com.epost.service.IJmsService;
import com.epost.service.IMongoService;
import com.epost.service.IOrderService;
import com.epost.util.*;
import com.epost.vo.*;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import javax.print.attribute.standard.Destination;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@Service("iOrderService")
@Slf4j
public class OrderServiceImpl implements IOrderService {
    //初始化支付宝支付服务，加载配置文件
    private static AlipayTradeService tradeService;
    static {
        Configs.init("zfbinfo.properties");
        tradeService = new AlipayTradeServiceImpl.ClientBuilder().build();
    }
    //private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Resource
    private OrderMapper orderMapper;
    @Resource
    private OrderItemMapper orderItemMapper;
    @Resource
    private PayInfoMapper payInfoMapper;
    @Resource
    private CartMapper cartMapper;
    @Resource
    private ProductMapper productMapper;
    @Resource
    private ShippingMapper shippingMapper;
    @Resource
    private SeckillOrderMapper seckillOrderMapper;

    @Autowired
    private IJmsService iJmsService;
    @Autowired
    private IMongoService iMongoService;

    //支付宝下单接口(返回二维码)
    @Override
    public ServerResponse pay(Long orderNo, Integer userId, String path) {
        Map<String, String> resultMap = Maps.newHashMap();
        Order order = orderMapper.selectByUserIdAndOrderNo(userId, orderNo);
        if (order == null) {
            return ServerResponse.createByErrorMessage("用户没有该订单");
        }
        if(order.getShippingId() == null){
            return ServerResponse.createByErrorMessage("没有收货地址");
        }
        resultMap.put("orderNo", String.valueOf(order.getOrderNo()));
        // (必填) 商户网站订单系统中唯一订单号，64个字符以内，只能包含字母、数字、下划线，
        // 需保证商户系统端不能重复，建议通过数据库sequence生成，
        String outTradeNo = order.getOrderNo().toString();
        // (必填) 订单标题，粗略描述用户的支付目的。如“xxx品牌xxx门店当面付扫码消费”
        String subject = new StringBuilder().append("EPost扫码支付，订单号：").append(outTradeNo).toString();
        // (必填) 订单总金额，单位为元，不能超过1亿元
        // 如果同时传入了【打折金额】,【不可打折金额】,【订单总金额】三者,则必须满足如下条件:【订单总金额】=【打折金额】+【不可打折金额】
        String totalAmount = order.getPayment().toString();
        // (可选) 订单不可打折金额，可以配合商家平台配置折扣活动，如果酒水不参与打折，则将对应金额填写至此字段
        // 如果该值未传入,但传入了【订单总金额】,【打折金额】,则该值默认为【订单总金额】-【打折金额】
        String undiscountableAmount = "0";
        // 卖家支付宝账号ID，用于支持一个签约账号下支持打款到不同的收款账号，(打款到sellerId对应的支付宝账号)
        // 如果该字段为空，则默认为与支付宝签约的商户的PID，也就是appid对应的PID
        String sellerId = "";
        // 订单描述，可以对交易或商品进行一个详细地描述，比如填写"购买商品2件共15.00元"
        String body = new StringBuilder().append("订单").append(outTradeNo).append("购买商品共").append(totalAmount).append("元").toString();
        // 商户操作员编号，添加此参数可以为商户操作员做销售统计
        String operatorId = "test_operator_id";
        // (必填) 商户门店编号，通过门店号和商家后台可以配置精准到门店的折扣信息，详询支付宝技术支持
        String storeId = "test_store_id";
        // 业务扩展参数，目前可添加由支付宝分配的系统商编号(通过setSysServiceProviderId方法)，详情请咨询支付宝技术支持
        ExtendParams extendParams = new ExtendParams();
        extendParams.setSysServiceProviderId("2088100200300400500");
        // 支付超时，定义为120分钟
        String timeoutExpress = "120m";
        // 商品明细列表，需填写购买商品详细信息，
        List<GoodsDetail> goodsDetailList = new ArrayList<GoodsDetail>();
        List<OrderItem> orderItemList = orderItemMapper.getByOrderNoUserId(orderNo, userId);
        for (OrderItem orderItem : orderItemList) {
            GoodsDetail goods = GoodsDetail.newInstance(orderItem.getProductId().toString(), orderItem.getProductName(),
                    BigDecimalUtil.mul(orderItem.getCurrentUnitPrice().doubleValue(), new Double(100).doubleValue()).longValue(),
                    orderItem.getQuantity());
            goodsDetailList.add(goods);
        }

        // 创建扫码支付请求builder，设置请求参数
        AlipayTradePrecreateRequestBuilder builder = new AlipayTradePrecreateRequestBuilder()
                .setSubject(subject).setTotalAmount(totalAmount).setOutTradeNo(outTradeNo)
                .setUndiscountableAmount(undiscountableAmount).setSellerId(sellerId).setBody(body)
                .setOperatorId(operatorId).setStoreId(storeId).setExtendParams(extendParams)
                .setTimeoutExpress(timeoutExpress)
                .setNotifyUrl(PropertiesUtil.getProperty("alipay.callback.url"))//支付宝服务器主动通知商户服务器里指定的页面http路径,根据需要设置
                .setGoodsDetailList(goodsDetailList);

        //获取下单状态
        AlipayF2FPrecreateResult result = tradeService.tradePrecreate(builder);
        switch (result.getTradeStatus()) {
            case SUCCESS:
                log.info("支付宝预下单成功: )");
                AlipayTradePrecreateResponse response = result.getResponse();
                dumpResponse(response);

                File folder = new File(path);
                if (!folder.exists()) {
                    folder.setWritable(true);
                    folder.mkdirs();
                }
                // 需要修改为运行机器上的路径
                // 细节
                String qrPath = String.format(path + "/qr-%s.png", response.getOutTradeNo());
                String qrFileName = String.format("qr-%s.png", response.getOutTradeNo());
                //生成二维码图片
                ZxingUtils.getQRCodeImge(response.getQrCode(), 256, qrPath);
                //将二维码上传到ftp服务器上
                File targetFile = new File(path, qrFileName);
                try {
                    FTPUtil.uploadFile(Lists.newArrayList(targetFile));
                } catch (IOException e) {
                    log.error("上传二维码异常", e);
                }
                log.info("qrPath:" + qrPath);
                String qrUrl = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFile.getName();
                resultMap.put("qrUrl", qrUrl);
                return ServerResponse.createBySuccess(resultMap);
            case FAILED:
                log.error("支付宝预下单失败!!!");
                return ServerResponse.createByErrorMessage("支付宝预下单失败!!!");
            case UNKNOWN:
                log.error("系统异常，预下单状态未知!!!");
                return ServerResponse.createByErrorMessage("系统异常，预下单状态未知!!!");
            default:
                log.error("不支持的交易状态，交易返回异常!!!");
                return ServerResponse.createByErrorMessage("不支持的交易状态，交易返回异常!!!");
        }
    }

    //支付宝回调接口（定时回调传入支付状态）
    @Override
    public ServerResponse aliCallback(Map<String, String> params) {
        //支付宝返回支付状态和支付流水
        Long orderNo = Long.parseLong(params.get("out_trade_no"));
        String tradeNo = params.get("trade_no");
        String tradeStatus = params.get("trade_status");

        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order == null) {
            return ServerResponse.createByErrorMessage("非本商城的订单，回调忽略");
        }
        //如果是已付款就跳过避免重复调用
        if (order.getStatus() >= Const.OrderStatusEnum.PAID.getCode()) {
            return ServerResponse.createBySuccess("支付宝重复调用");
        }
        //支付成功就更新订单状态
        if (Const.AlipayCallback.TRADE_STATUS_TRADE_SUCCESS.equals(tradeStatus)) {
            order.setPaymentTime(DateTimeUtil.strToDate(params.get("gmt_payment")));
            order.setStatus(Const.OrderStatusEnum.PAID.getCode());
            order.setUpdateTime(new Date());
            orderMapper.updateByPrimaryKeySelective(order);
        }
        //插入支付日志
        PayInfo payInfo = new PayInfo();
        payInfo.setUserId(order.getUserId());
        payInfo.setOrderNo(order.getOrderNo());
        payInfo.setPayPlatform(Const.PayPlatformEnum.ALIPAY.getCode());
        payInfo.setPlatformNumber(tradeNo);
        payInfo.setPlatformStatus(tradeStatus);

        payInfoMapper.insert(payInfo);
        return ServerResponse.createBySuccess();
    }

    //查询支付宝订单状态
    @Override
    public ServerResponse queryOrderPayStatus(Integer userId, Long orderNo) {
        Order order = orderMapper.selectByUserIdAndOrderNo(userId, orderNo);
        if (order == null) {
            return ServerResponse.createByErrorMessage("用户没有该订单");
        }
        if (order.getStatus() >= Const.OrderStatusEnum.PAID.getCode()) {
            //更新下销量
            List<OrderItem> orderItemList = orderItemMapper.getByOrderNo(order.getOrderNo());
            for(OrderItem orderItem : orderItemList){
                Integer volume = productMapper.selectVolumeByProductId(orderItem.getProductId());
                //考虑到已生成的订单里的商品，被删除的情况
                if(volume == null){
                    continue;
                }
                Product product =new Product();
                product.setId(orderItem.getProductId());
                product.setVolume(volume+orderItem.getQuantity());
                product.setUpdateTime(new Date());
                productMapper.updateByPrimaryKeySelective(product);

                //发送消息更新索引库
                iJmsService.sendMessage(orderItem.getProductId());
            }
            return ServerResponse.createBySuccess();
        }
        return ServerResponse.createByError();
    }

    //根据购物车创建订单（根据收货地址和用户id）
    @Override
    public ServerResponse createOrder(Integer userId, Integer shippingId) {
        List<Cart> cartList = cartMapper.selectCheckedCartByUserId(userId);
        ServerResponse serverResponse = this.getCartOrderItem(userId, cartList);
        if (!serverResponse.isSuccess()) {
            return serverResponse;
        }
        List<OrderItem> orderItemList = (List<OrderItem>) serverResponse.getData();
        BigDecimal payment = this.getOrderTotalPrice(orderItemList);
        //生成订单
        Order order = this.assembleOrder(userId, shippingId, payment);
        if (order == null) {
            return ServerResponse.createByErrorMessage("生成订单错误");
        }
        if (CollectionUtils.isEmpty(orderItemList)) {
            return ServerResponse.createByErrorMessage("购物车为空");
        }
        //设置每个订单项的订单号
        for (OrderItem orderItem : orderItemList) {
            orderItem.setOrderNo(order.getOrderNo());
        }
        //mybatis批量插入
        orderItemMapper.batchInsert(orderItemList);
        //生成成功，减少库存
        this.reduceProductStock(orderItemList);
        //清空购物车
        this.cleanCart(cartList);
        //返回给前端数据
        OrderVo orderVo = assembleOrderVo(order, orderItemList,null);
        return ServerResponse.createBySuccess(orderVo);
    }

    //取消订单（已经支付是无法取消）
    @Override
    public ServerResponse<String> cancel(Integer userId, Long orderNo) {
        Order order = orderMapper.selectByUserIdAndOrderNo(userId, orderNo);
        if (order == null) {
            return ServerResponse.createByErrorMessage("订单不存在！");
        }
        if (order.getStatus() != Const.OrderStatusEnum.NO_PAY.getCode()) {
            return ServerResponse.createByErrorMessage("已经付款，无法取消订单！");
        }
        Order updateOrder = new Order();
        updateOrder.setId(order.getId());
        updateOrder.setStatus(Const.OrderStatusEnum.CANCELED.getCode());

        int row = orderMapper.updateByPrimaryKeySelective(updateOrder);
        if (row > 0) {
            return ServerResponse.createBySuccess();
        }
        return ServerResponse.createByError();
    }

    @Override
    public ServerResponse getOrderCartProduct(Integer userId) {
        OrderProductVo orderProductVo = new OrderProductVo();

        List<Cart> cartList = cartMapper.selectCheckedCartByUserId(userId);
        ServerResponse serverResponse = this.getCartOrderItem(userId, cartList);

        if (!serverResponse.isSuccess()) {
            return serverResponse;
        }
        List<OrderItem> orderItemList = (List<OrderItem>) serverResponse.getData();

        List<OrderItemVo> orderItemVoList = Lists.newArrayList();

        BigDecimal payment = new BigDecimal("0");
        for (OrderItem orderItem : orderItemList) {
            payment = BigDecimalUtil.add(payment.doubleValue(), orderItem.getTotalPrice().doubleValue());
            orderItemVoList.add(assembleOrderItemVo(orderItem));
        }
        orderProductVo.setProductTotalPrice(payment);
        orderProductVo.setOrderItemVoList(orderItemVoList);
        orderProductVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix"));

        return ServerResponse.createBySuccess(orderProductVo);
    }

    //获取订单详情
    @Override
    public ServerResponse<OrderVo> getOrderDetail(Integer userId, Long orderNo) {
        Order order = orderMapper.selectByUserIdAndOrderNo(userId, orderNo);
        //判断是否和秒杀活动关联
        SeckillOrder seckillOrder =  seckillOrderMapper.selectOrderByUserAndOrderNo(userId,orderNo);
        Integer seckillId = null;
        if(seckillOrder!=null){
            seckillId = seckillOrder.getSeckillId();
        }
        if (order != null) {
            List<OrderItem> orderItemList = orderItemMapper.getByOrderNoUserId(orderNo, userId);
            OrderVo orderVo = assembleOrderVo(order, orderItemList,seckillId);
            //判断是否已经发货
            if(order.getStatus()>=Const.OrderStatusEnum.SHIPPED.getCode()){
                Map<String,Object> params = new HashMap<>();
                params.put("orderNo",orderNo);
                List<Map> list =  iMongoService.query(params,"post");
                if(list.size()>0){
                   orderVo.setTradeVoList(assembleTradeVoList(list.get(0).get("tradeNo").toString()));
                }
            }
            return ServerResponse.createBySuccess(orderVo);
        }
        return ServerResponse.createByErrorMessage("没有找到该订单");
    }

    //获取订单列表
    @Override
    public ServerResponse<PageInfo> getOrderList(Integer userId, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Order> orderList = orderMapper.selectByUserId(userId);
        List<OrderVo> orderVoList = assembleOrderVoList(orderList, userId);
        PageInfo pageResult = new PageInfo(orderList);
        pageResult.setList(orderVoList);
        return ServerResponse.createBySuccess(pageResult);
    }

    //后台：获取订单列表
    @Override
    public ServerResponse<PageInfo> manageList(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        List<Order> orderList = orderMapper.selectAllOrder();
        List<OrderVo> orderVoList = this.assembleOrderVoList(orderList, null);
        PageInfo pageResult = new PageInfo(orderList);
        pageResult.setList(orderVoList);
        return ServerResponse.createBySuccess(pageResult);
    }

    //后台：获取订单详情
    @Override
    public ServerResponse<OrderVo> manageDetail(Long orderNo) {
        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order != null) {
            List<OrderItem> orderItemList = orderItemMapper.getByOrderNo(orderNo);
            OrderVo orderVo = assembleOrderVo(order, orderItemList,null);
            return ServerResponse.createBySuccess(orderVo);
        }
        return ServerResponse.createByErrorMessage("订单不存在");
    }

    //后台：获取带有条件订单列表
    @Override
    public ServerResponse<PageInfo> manageSearch(Long orderNo, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order != null) {
            List<OrderItem> orderItemList = orderItemMapper.getByOrderNo(orderNo);
            OrderVo orderVo = assembleOrderVo(order, orderItemList,null);

            PageInfo pageResult = new PageInfo(Lists.newArrayList(order));
            pageResult.setList(Lists.newArrayList(orderVo));
            return ServerResponse.createBySuccess(pageResult);
        }
        return ServerResponse.createByErrorMessage("订单不存在！");
    }

    //后台：发货
    @Override
    public ServerResponse<String> manageSendGoods(Long orderNo,String post) {
        if(StringUtils.isEmpty(post)){
            return ServerResponse.createByErrorMessage("快递单号为空发货失败");
        }else{
            Map<String,Object> postNo = new HashMap<String,Object>();
            postNo.put("orderNo",orderNo);
            postNo.put("tradeNo",post);
            iMongoService.addData(postNo,"post");
        }
        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order != null) {
            if (order.getStatus() == Const.OrderStatusEnum.PAID.getCode()) {
                order.setStatus(Const.OrderStatusEnum.SHIPPED.getCode());
                order.setSendTime(new Date());
                orderMapper.updateByPrimaryKeySelective(order);
                return ServerResponse.createBySuccess("发货成功");
            }
        }
        return ServerResponse.createByErrorMessage("订单不存在");
    }

    //商户退款(库存架，销量减)
    public ServerResponse<String> manageRefund(Long orderNo){
        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order == null) {
            return ServerResponse.createByErrorMessage("订单不存在");
        }
        //判断订单是否支付
        if (order.getStatus() >= Const.OrderStatusEnum.PAID.getCode()) {
            //申请支付宝退款
            // (必填) 外部订单号，需要退款交易的商户外部订单号
            String outTradeNo = order.getOrderNo().toString();
            // (必填) 退款金额，该金额必须小于等于订单的支付金额，单位为元
            String refundAmount = order.getPayment().toString();
            // (可选，需要支持重复退货时必填) 商户退款请求号，相同支付宝交易号下的不同退款请求号对应同一笔交易的不同退款申请，
            // 对于相同支付宝交易号下多笔相同商户退款请求号的退款交易，支付宝只会进行一次退款
            String outRequestNo = "";
            // (必填) 退款原因，可以说明用户退款原因，方便为商家后台提供统计
            String refundReason = "卖家买家协议退款";
            // (必填) 商户门店编号，退款情况下可以为商家后台提供退款权限判定和统计等作用，详询支付宝技术支持
            String storeId = "test_store_id";

            // 创建退款请求builder，设置请求参数
            AlipayTradeRefundRequestBuilder builder = new AlipayTradeRefundRequestBuilder()
                    .setOutTradeNo(outTradeNo).setRefundAmount(refundAmount).setRefundReason(refundReason)
                    .setOutRequestNo(outRequestNo).setStoreId(storeId);

            AlipayF2FRefundResult result = tradeService.tradeRefund(builder);
            switch (result.getTradeStatus()) {
                case SUCCESS:
                    //库存回滚
                    List<OrderItem> orderItemList = orderItemMapper.getByOrderNo(order.getOrderNo());
                    for(OrderItem orderItem : orderItemList){
                        Product product = productMapper.selectByPrimaryKey(orderItem.getProductId());
                        //考虑到已生成的订单里的商品，被删除的情况
                        if(product == null){
                            continue;
                        }
                        product.setId(orderItem.getProductId());
                        product.setStock(product.getStock()+orderItem.getQuantity());
                        product.setVolume(product.getVolume()-orderItem.getQuantity());
                        product.setUpdateTime(new Date());
                        productMapper.updateByPrimaryKeySelective(product);

                        //发送消息更新索引库
                        iJmsService.sendMessage(orderItem.getProductId());
                    }
                    //修改订单状态
                    order.setStatus(Const.OrderStatusEnum.ORDER_REFUND.getCode());
                    orderMapper.updateByPrimaryKeySelective(order);
                    //插入退款记录
                    PayInfo payInfo = new PayInfo();
                    payInfo.setUserId(order.getUserId());
                    payInfo.setOrderNo(order.getOrderNo());
                    payInfo.setPayPlatform(Const.PayPlatformEnum.ALIPAY.getCode());
                    payInfo.setPlatformNumber(order.getPayment().toString());
                    payInfo.setPlatformStatus("TRADE_REFUND_SUCCESS");
                    return ServerResponse.createBySuccess("退款成功");
                case FAILED:
                    return ServerResponse.createBySuccess("退款失败!!!");
                case UNKNOWN:
                    return ServerResponse.createBySuccess("系统异常，订单退款状态未知!!!");
                default:
                    return ServerResponse.createBySuccess("不支持的交易状态，交易返回异常!!!");
            }
        }else{
            return ServerResponse.createByErrorMessage("订单未支付，请取消订单");
        }
    }

    //将订单类转换成订单列表对象
    private List<OrderVo> assembleOrderVoList(List<Order> orderList, Integer userId) {
        List<OrderVo> orderVoList = Lists.newArrayList();
        for (Order order : orderList) {
            List<OrderItem> orderItemList = Lists.newArrayList();
            if (userId == null) {
                //管理员是不需要传参数
                orderItemList = orderItemMapper.getByOrderNo(order.getOrderNo());
            } else {
                orderItemList = orderItemMapper.getByOrderNoUserId(order.getOrderNo(), userId);
            }
            OrderVo orderVo = assembleOrderVo(order, orderItemList,null);
            orderVoList.add(orderVo);
        }
        return orderVoList;
    }

    //将购物车列表转换成订单项
    private ServerResponse getCartOrderItem(Integer userId, List<Cart> cartList) {
        List<OrderItem> orderItemList = Lists.newArrayList();
        if (CollectionUtils.isEmpty(cartList)) {
            return ServerResponse.createByErrorMessage("购物车为空");
        }
        for (Cart cartItem : cartList) {
            OrderItem orderItem = new OrderItem();
            Product product = productMapper.selectByPrimaryKey(cartItem.getProductId());
            if (Const.ProductStatusEnum.ON_SALE.getCode() != product.getStatus()) {
                return ServerResponse.createByErrorMessage("产品" + product.getName() + "不是在售商品");
            }
            if (cartItem.getQuantity() > product.getStock()) {
                return ServerResponse.createByErrorMessage("产品" + product.getName() + "库存不足");
            }
            orderItem.setUserId(userId);
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductImage(product.getMainImage());
            orderItem.setCurrentUnitPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(BigDecimalUtil.mul(product.getPrice().doubleValue(), cartItem.getQuantity()));
            orderItemList.add(orderItem);
        }
        return ServerResponse.createBySuccess(orderItemList);
    }
    //获取订单总价格
    private BigDecimal getOrderTotalPrice(List<OrderItem> orderItemList) {
        BigDecimal payment = new BigDecimal("0");
        for (OrderItem orderItem : orderItemList) {
            payment = BigDecimalUtil.add(payment.doubleValue(), orderItem.getTotalPrice().doubleValue());
        }
        return payment;
    }
    //创建订单(根据地址，订单总金额)
    private Order assembleOrder(Integer userId, Integer shippingId, BigDecimal payment) {
        Order order = new Order();
        Long orderNo = this.generateOrderNo();
        order.setOrderNo(orderNo);
        order.setStatus(Const.OrderStatusEnum.NO_PAY.getCode());
        order.setPostage(0);
        order.setPaymentType(Const.PaymentTypeEnum.ONLINE_PAY.getCode());
        order.setPayment(payment);
        order.setUserId(userId);
        order.setShippingId(shippingId);
        int rowCount = orderMapper.insert(order);
        if (rowCount > 0) {
            return order;
        }
        return null;
    }

    //根据订单项减少商品库存数
    private void reduceProductStock(List<OrderItem> orderItemList) {
        for (OrderItem orderItem : orderItemList) {
            Product product = productMapper.selectByPrimaryKey(orderItem.getProductId());
            product.setStock(product.getStock() - orderItem.getQuantity());
            productMapper.updateByPrimaryKeySelective(product);

            //发送消息更新索引库
            iJmsService.sendMessage(orderItem.getProductId());
        }
    }

    //生成随机订单号
    private Long generateOrderNo() {
        Long currentTime = System.currentTimeMillis();
        //100个人并发，下单，不会失败。数据库中是唯一索引。
        return currentTime + new Random().nextInt(100);
    }

    //下单之后清除购物车列表
    private void cleanCart(List<Cart> cartList) {
        for (Cart cart : cartList) {
            cartMapper.deleteByPrimaryKey(cart.getId());
        }
    }

    //生成前端需要订单对象
    private OrderVo assembleOrderVo(Order order, List<OrderItem> orderItemList,Integer SeckillId) {
        OrderVo orderVo = new OrderVo();
        orderVo.setOrderNo(order.getOrderNo());
        orderVo.setPayment(order.getPayment());
        orderVo.setPaymentType(order.getPaymentType());
        orderVo.setPaymentTypeDesc(Const.PaymentTypeEnum.codeOf(order.getPaymentType()).getValue());

        orderVo.setPostage(order.getPostage());
        orderVo.setStatus(order.getStatus());
        orderVo.setStatusDesc(Const.OrderStatusEnum.codeOf(order.getStatus()).getValue());

        orderVo.setShippingId(order.getShippingId());
        Shipping shipping = shippingMapper.selectByPrimaryKey(order.getShippingId());
        if (shipping != null) {
            orderVo.setReceiverName(shipping.getReceiverName());
            orderVo.setShippingVo(assembleShippingVo(shipping));
        }
        orderVo.setPaymentTime(DateTimeUtil.dateToStr(order.getPaymentTime()));
        orderVo.setSendTime(DateTimeUtil.dateToStr(order.getSendTime()));
        orderVo.setEndTime(DateTimeUtil.dateToStr(order.getEndTime()));
        orderVo.setCreateTime(DateTimeUtil.dateToStr(order.getCreateTime()));
        orderVo.setCloseTime(DateTimeUtil.dateToStr(order.getCloseTime()));

        orderVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix"));
        orderVo.setSeckillId(SeckillId);

        List<OrderItemVo> orderItemVoList = Lists.newArrayList();
        for (OrderItem orderItem : orderItemList) {
            OrderItemVo orderItemVo = assembleOrderItemVo(orderItem);
            orderItemVoList.add(orderItemVo);
        }
        orderVo.setOrderItemVoList(orderItemVoList);
        return orderVo;
    }
    //生成前段需要订单项对象
    private OrderItemVo assembleOrderItemVo(OrderItem orderItem) {
        OrderItemVo orderItemVo = new OrderItemVo();
        orderItemVo.setOrderNo(orderItem.getOrderNo());
        orderItemVo.setProductId(orderItem.getProductId());
        orderItemVo.setProductName(orderItem.getProductName());
        orderItemVo.setProductImage(orderItem.getProductImage());
        orderItemVo.setCurrentUnitPrice(orderItem.getCurrentUnitPrice());
        orderItemVo.setQuantity(orderItem.getQuantity());
        orderItemVo.setTotalPrice(orderItem.getTotalPrice());

        orderItemVo.setCreateTime(DateTimeUtil.dateToStr(orderItem.getCreateTime()));
        return orderItemVo;
    }
    //生成前段需要地址对象
    private ShippingVo assembleShippingVo(Shipping shipping) {
        ShippingVo shippingVo = new ShippingVo();
        shippingVo.setReceiverName(shipping.getReceiverName());
        shippingVo.setReceiverAddress(shipping.getReceiverAddress());
        shippingVo.setReceiverProvince(shipping.getReceiverProvince());
        shippingVo.setReceiverCity(shipping.getReceiverCity());
        shippingVo.setReceiverDistrict(shipping.getReceiverDistrict());
        shippingVo.setReceiverMobile(shipping.getReceiverMobile());
        shippingVo.setReceiverZip(shipping.getReceiverZip());
        shippingVo.setReceiverPhone(shippingVo.getReceiverPhone());
        return shippingVo;
    }

    // 简单打印应答
    private void dumpResponse(AlipayResponse response) {
        if (response != null) {
            log.info(String.format("code:%s, msg:%s", response.getCode(), response.getMsg()));
            if (StringUtils.isNotEmpty(response.getSubCode())) {
                log.info(String.format("subCode:%s, subMsg:%s", response.getSubCode(),
                        response.getSubMsg()));
            }
            log.info("body:" + response.getBody());
        }
    }

    //定时取消订单
    @Override
    public void closeOrder(int hour) {
        Date closeDateTime = DateUtils.addHours(new Date(),-hour);
        //查询超时的订单
        List<Order> orderList = orderMapper.selectOrderStatusByCreateTime(Const.OrderStatusEnum.NO_PAY.getCode()
                ,DateTimeUtil.dateToStr(closeDateTime));

        for(Order order : orderList){
            List<OrderItem> orderItemList = orderItemMapper.getByOrderNo(order.getOrderNo());
            for(OrderItem orderItem : orderItemList){
                //一定要用主键where条件，防止锁表。同时必须是支持MySQL的InnoDB。（查询订单库存）
                Integer stock = productMapper.selectStockByProductId(orderItem.getProductId());
                //考虑到已生成的订单里的商品，被删除的情况
                if(stock == null){
                    continue;
                }
                Product product = new Product();
                product.setId(orderItem.getProductId());
                product.setStock(stock+orderItem.getQuantity());
                productMapper.updateByPrimaryKeySelective(product);

                //发送消息更新索引库
                iJmsService.sendMessage(orderItem.getProductId());
            }
            //取消订单
            orderMapper.closeOrderByOrderId(order.getId());
            log.info("关闭订单OrderNo：{}",order.getOrderNo());
        }
    }

    private List<TradeVo> assembleTradeVoList(String tradeNo){
        List<String> tradeNos =  Lists.newArrayList(tradeNo.split(","));
        List<TradeVo> tradeVoList = Lists.newArrayList();
        //查询物流轨迹信息
        KdniaoTrackQueryAPI api = new KdniaoTrackQueryAPI();
        for(String no:tradeNos){
            TradeVo tradeVo = new TradeVo();
            tradeVo.setTradeNo(no);
            String result = api.getOrderTracesByJson("EMS",no);
            if(StringUtils.isNotBlank(result)){
                tradeVo.setTrade(JsonUtil.string2Obj(result,Map.class).get("Traces"));
            }
            tradeVoList.add(tradeVo);
        }
        return tradeVoList;
    }

}
