package com.epost.controller.backend;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.IOrderService;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import com.epost.vo.OrderVo;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/manage/order")
@CrossOrigin(origins = "*")
public class OrderManageController {

    @Autowired
    private IUserService iUserService;
    @Autowired
    private IOrderService iOrderService;

    //获取订单列表
    @RequestMapping(value="list.do",method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<PageInfo> orderList(HttpServletRequest httpServletRequest, @RequestParam(value = "pageNum",defaultValue = "1") int pageNum,
                                              @RequestParam(value = "pageSize",defaultValue = "10")int pageSize){
        //填充我们增加产品的业务逻辑
        return iOrderService.manageList(pageNum,pageSize);
    }

    //获取订单详情
    @RequestMapping(value="detail.do",method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<OrderVo> orderDetail(HttpServletRequest httpServletRequest, Long orderNo){

        //填充我们增加产品的业务逻辑
        return iOrderService.manageDetail(orderNo);
    }

    //获取带条件的订单列表
    @RequestMapping(value="search.do",method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<PageInfo> orderSearch(HttpServletRequest httpServletRequest, Long orderNo,
                                                @RequestParam(value = "pageNum",defaultValue = "1") int pageNum,
                                                @RequestParam(value = "pageSize",defaultValue = "10")int pageSize){
        //填充我们增加产品的业务逻辑
        return iOrderService.manageSearch(orderNo,pageNum,pageSize);
    }

    //订单发货处理
    @RequestMapping(value="send_goods.do",method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<String> orderSendGoods(HttpServletRequest httpServletRequest, Long orderNo,String post){
        //填充我们增加产品的业务逻辑
        return iOrderService.manageSendGoods(orderNo,post);
    }


    //订单退款处理
    @RequestMapping(value="refund.do",method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<String> orderRefund(HttpServletRequest httpServletRequest, Long orderNo){

        //退款
        return iOrderService.manageRefund(orderNo);
    }

}
