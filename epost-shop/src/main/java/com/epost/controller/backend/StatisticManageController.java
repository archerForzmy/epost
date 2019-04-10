package com.epost.controller.backend;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.IStatisticService;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.DateTimeUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;

@RestController
@RequestMapping("/manage/statistic")
@CrossOrigin(origins = "*")
public class StatisticManageController {
    @Autowired
    private IUserService iUserService;
    @Autowired
    private IStatisticService iStatisticService;
    //获取首页基本信息
    @RequestMapping(value = "base_count.do", method = RequestMethod.POST)
    public ServerResponse getBastCount(HttpServletRequest httpServletRequest) {
        return iStatisticService.getCount();
    }
    //获取系统时间
    @RequestMapping(value = "now.do", method = RequestMethod.POST)
    public ServerResponse getNowDate(){
        return ServerResponse.createBySuccess(DateTimeUtil.dateToStr(new Date(),DateTimeUtil.STANDARD_FORMAT));
    }
}
