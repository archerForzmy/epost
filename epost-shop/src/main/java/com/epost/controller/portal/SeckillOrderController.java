package com.epost.controller.portal;

import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.ISeckillOrderService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/seckillOrder")
@CrossOrigin(origins = "*")
public class SeckillOrderController {
    @Autowired
    ISeckillOrderService iSeckillOrderService;

    //返回秒杀详情页数据
    @RequestMapping(value="detail.do",method = RequestMethod.POST)
    public ServerResponse detail(HttpServletRequest httpServletRequest, Integer seckillId){
        String loginToken = CookieUtil.readLoginToken(httpServletRequest);
        if(StringUtils.isEmpty(loginToken)){
            return ServerResponse.createByErrorMessage("用户未登录,无法获取当前用户的信息");
        }
        String userJsonStr = RedisShardedPoolUtil.get(loginToken);
        User user = JsonUtil.string2Obj(userJsonStr,User.class);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), ResponseCode.NEED_LOGIN.getDesc());
        }
        return iSeckillOrderService.getSeckillOrderDetail(user.getId(),seckillId);
    }
    //给秒杀订单添加收货地址
    @RequestMapping(value="create.do",method = RequestMethod.POST)
    public ServerResponse saveSeckillOrder(HttpServletRequest httpServletRequest,Integer seckillId ,Integer shippingId){
        String loginToken = CookieUtil.readLoginToken(httpServletRequest);
        if(StringUtils.isEmpty(loginToken)){
            return ServerResponse.createByErrorMessage("用户未登录,无法获取当前用户的信息");
        }
        String userJsonStr = RedisShardedPoolUtil.get(loginToken);
        User user = JsonUtil.string2Obj(userJsonStr,User.class);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), ResponseCode.NEED_LOGIN.getDesc());
        }
        return iSeckillOrderService.createOrder(user.getId(),seckillId,shippingId);
    }
}
