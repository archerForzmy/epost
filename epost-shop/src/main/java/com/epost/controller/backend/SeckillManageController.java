package com.epost.controller.backend;

import com.epost.common.ServerResponse;
import com.epost.pojo.Seckill;
import com.epost.service.ISeckillService;
import com.epost.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/manage/seckill")
@CrossOrigin(origins = "*")
public class SeckillManageController {
    @Autowired
    private IUserService iUserService;
    @Autowired
    private ISeckillService iSeckillService;

    //添加或者更新秒杀活动
    @RequestMapping(value = "save.do", method = RequestMethod.POST)
    public ServerResponse seckillSave(HttpServletRequest httpServletRequest, Seckill seckill) {
        //填充我们增加秒杀活动逻辑
        return iSeckillService.saveOrUpdateSeckill(seckill);
    }

    //获取秒杀列表
    @RequestMapping(value = "list.do", method = RequestMethod.POST)
    public ServerResponse getList(HttpServletRequest httpServletRequest,
                                  @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        //填充业务
        return iSeckillService.getSeckillList(pageNum, pageSize);
    }

    //获取带条件秒杀列表
    @RequestMapping(value = "search.do", method = RequestMethod.POST)
    public ServerResponse seckillSearch(HttpServletRequest httpServletRequest, String seckillName,Integer seckillId,
                                           @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                           @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        //填充业务
        return iSeckillService.searchSeckill(seckillName, seckillId,pageNum, pageSize);
    }

    //获取秒杀详情
    @RequestMapping(value = "detail.do", method = RequestMethod.POST)
    public ServerResponse getDetail(HttpServletRequest httpServletRequest, Integer seckillId) {
        //填充业务
        return iSeckillService.manageSeckillDetail(seckillId);
    }

    //日期转换（spring mvc字符串转date类型）
    @InitBinder
    public void initBinder(ServletRequestDataBinder bin) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        CustomDateEditor cust = new CustomDateEditor(sdf, true);
        bin.registerCustomEditor(Date.class, cust);
    }
}
