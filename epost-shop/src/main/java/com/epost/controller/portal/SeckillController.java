package com.epost.controller.portal;

import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.ISeckillService;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/seckill")
@CrossOrigin(origins = "*")
public class SeckillController {
    @Autowired
    private IUserService iUserService;
    @Autowired
    private ISeckillService iSeckillService;

    //返回秒杀详情页数据
    @RequestMapping(value="detail.do",method = RequestMethod.POST)
    public ServerResponse detail(Integer seckillId){
        return iSeckillService.getSeckillDetail(seckillId);
    }

    //前台将要秒杀的商品和正在秒杀的商品（按照时间排序）
    @RequestMapping(value="list.do",method = RequestMethod.POST)
    public ServerResponse list(){
        return iSeckillService.getSeckillListByTime();
    }

    //秒杀方法（重点）
    @RequestMapping(value="seckill.do",method = RequestMethod.POST)
    public ServerResponse seckill(HttpServletRequest httpServletRequest, Integer count, Integer seckillId,String token){
        String loginToken = CookieUtil.readLoginToken(httpServletRequest);
        if(StringUtils.isEmpty(loginToken)){
            return ServerResponse.createByErrorMessage("用户未登录,无法获取当前用户的信息");
        }
        String userJsonStr = RedisShardedPoolUtil.get(loginToken);
        User user = JsonUtil.string2Obj(userJsonStr,User.class);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), ResponseCode.NEED_LOGIN.getDesc());
        }
        return iSeckillService.seckill(user.getId(),count,seckillId,token);
    }
}
