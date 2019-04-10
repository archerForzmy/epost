package com.epost.controller.portal;

import com.epost.common.ServerResponse;
import com.epost.service.IPropagandaService;
import com.epost.vo.PropagandaDetailVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/propaganda/")
@CrossOrigin(origins = "*")
public class PropagandaController {

    @Autowired
    IPropagandaService iPropagandaService;

    //获取首页轮播图
    @RequestMapping(value="list.do",method = RequestMethod.POST)
    public ServerResponse<List<PropagandaDetailVo>> list(){
        return iPropagandaService.getBanner();
    }
}
