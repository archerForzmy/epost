package com.epost.controller.backend;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.Propaganda;
import com.epost.pojo.User;
import com.epost.service.IPropagandaService;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/manage/propaganda")
@CrossOrigin(origins = "*")
public class PropagandaManageController {
    @Autowired
    private IUserService iUserService;
    @Autowired
    private IPropagandaService iPropagandaService;
    //添加或者更新广告
    @RequestMapping(value = "save.do", method = RequestMethod.POST)
    public ServerResponse propagandaSave(HttpServletRequest httpServletRequest, Propaganda propaganda) {
        //填充我们增加产品的业务逻辑
        return iPropagandaService.saveOrUpdatePropaganda(propaganda);
    }

    //获取广告列表
    @RequestMapping(value = "list.do", method = RequestMethod.POST)
    public ServerResponse getList(HttpServletRequest httpServletRequest,
                                  @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        //填充业务
        return iPropagandaService.getPropagandaList(pageNum, pageSize);
    }

    //获取带条件广告列表
    @RequestMapping(value = "search.do", method = RequestMethod.POST)
    public ServerResponse propagandaSearch(HttpServletRequest httpServletRequest, String propagandaName,
                                        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        //填充业务
        return iPropagandaService.searchPropaganda(propagandaName, pageNum, pageSize);
    }

    //获取广告详情
    @RequestMapping(value = "detail.do", method = RequestMethod.POST)
    public ServerResponse getDetail(HttpServletRequest httpServletRequest, Integer propagandaId) {
        //填充业务
        return iPropagandaService.managePropagandaDetail(propagandaId);
    }
}
