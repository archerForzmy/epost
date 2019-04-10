package com.epost.controller.backend;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/manage/user")
@CrossOrigin(origins = "*")
public class UserManageController {
    @Autowired
    private IUserService iUserService;

    @RequestMapping(value="login.do",method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<User> login(String username, String password,HttpSession session, HttpServletResponse httpServletResponse){
        ServerResponse<User> response = iUserService.login(username,password);
        if(response.isSuccess()){
            User user = response.getData();
            if(user.getRole() == Const.Role.ROLE_ADMIN){
                //说明登录的是管理员
                //新增redis共享cookie，session的方式
                CookieUtil.writeLoginToken(httpServletResponse,session.getId());
                RedisShardedPoolUtil.setEx(session.getId(), JsonUtil.obj2String(response.getData()),Const.RedisCacheExtime.REDIS_SESSION_EXTIME);
                return response;
            }else{
                return ServerResponse.createByErrorMessage("不是管理员,无法登录");
            }
        }
        return response;
    }

    @RequestMapping(value="list.do",method = RequestMethod.POST)
    public ServerResponse getList(HttpServletRequest httpServletRequest, @RequestParam(value = "pageNum",defaultValue = "1")
            int pageNum, @RequestParam(value = "pageSize",defaultValue = "10") int pageSize){
        //填充业务
        return iUserService.getUserList(pageNum,pageSize);
    }

    //用户枷锁或者解锁
    @RequestMapping(value = "lock.do", method = RequestMethod.POST)
    public ServerResponse setLock(HttpServletRequest httpServletRequest, Integer userId, Integer lock) {
        return iUserService.setlock(userId, lock);
    }
}
