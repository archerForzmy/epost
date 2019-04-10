package com.epost.service.impl;

import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.dao.PropagandaMapper;
import com.epost.pojo.Propaganda;
import com.epost.service.IPropagandaService;
import com.epost.util.DateTimeUtil;
import com.epost.util.PropertiesUtil;
import com.epost.vo.PropagandaDetailVo;
import com.epost.vo.PropagandaListVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("iPropagandaService")
@Slf4j
public class PropagandaServiceImpl implements IPropagandaService {
    @Resource
    PropagandaMapper propagandaMapper;
    //添加或更新一个广告
    @Override
    public ServerResponse saveOrUpdatePropaganda(Propaganda propaganda){
        if(propaganda != null) {
            //判断是更新还是添加商品
            if (propaganda.getId() != null) {
                int rowCount = propagandaMapper.updateByPrimaryKeySelective(propaganda);
                if (rowCount > 0) {
                    return ServerResponse.createBySuccess("更新广告成功");
                }
                return ServerResponse.createByErrorMessage("更新广告失败");
            } else {
                int rowCount = propagandaMapper.insert(propaganda);
                if (rowCount > 0) {
                    return ServerResponse.createBySuccess("新增广告成功");
                }
                return ServerResponse.createByErrorMessage("新增广告失败");
            }
        }
        return ServerResponse.createByErrorMessage("新增或更新广告参数不正确");
    }

    @Override
    public ServerResponse searchPropaganda(String propagandaName, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        if(StringUtils.isNotBlank(propagandaName)){
            propagandaName = new StringBuilder().append("%").append(propagandaName).append("%").toString();
        }
        List<Propaganda> propagandaList = propagandaMapper.selectByName(propagandaName);
        List<PropagandaListVo> propagandaListVoList = Lists.newArrayList();
        for(Propaganda propagandaItem : propagandaList){
            PropagandaListVo propagandaListVo = assemblePropagandaListVo(propagandaItem);
            propagandaListVoList.add(propagandaListVo);
        }
        PageInfo pageResult = new PageInfo(propagandaList);
        pageResult.setList(propagandaListVoList);
        return ServerResponse.createBySuccess(pageResult);
    }

    @Override
    public ServerResponse getPropagandaList(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<Propaganda> propagandaList = propagandaMapper.selectList();

        List<PropagandaListVo> propagandaListVoList = Lists.newArrayList();
        for(Propaganda propagandaItem : propagandaList){
            PropagandaListVo propagandaListVo = assemblePropagandaListVo(propagandaItem);
            propagandaListVoList.add(propagandaListVo);
        }
        PageInfo pageResult = new PageInfo(propagandaList);
        pageResult.setList(propagandaListVoList);
        return ServerResponse.createBySuccess(pageResult);
    }

    /**
     * 获取轮播图
     * @return
     */
    public ServerResponse getBanner(){
        List<Propaganda> propagandaList = propagandaMapper.selectListBySort();
        List<PropagandaDetailVo> propagandaDetailVoList = Lists.newArrayList();
        for(Propaganda propagandaItem : propagandaList){
            PropagandaDetailVo propagandaDetailVo = assemblePropagandaDetailVo(propagandaItem);
            propagandaDetailVoList.add(propagandaDetailVo);
        }
        return ServerResponse.createBySuccess(propagandaDetailVoList);
    }

    //根据id获取广告的详情数据
    @Override
    public ServerResponse<PropagandaDetailVo> managePropagandaDetail(Integer propagandaId) {
        if(propagandaId == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        Propaganda propaganda = propagandaMapper.selectByPrimaryKey(propagandaId);
        if(propaganda == null){
            return ServerResponse.createByErrorMessage("广告已下架或者删除");
        }
        PropagandaDetailVo propagandaDetailVo = assemblePropagandaDetailVo(propaganda);
        return ServerResponse.createBySuccess(propagandaDetailVo);
    }

    private PropagandaListVo assemblePropagandaListVo(Propaganda propaganda){
        PropagandaListVo propagandaListVo = new PropagandaListVo();
        propagandaListVo.setId(propaganda.getId());
        propagandaListVo.setName(propaganda.getName());
        propagandaListVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.happymmall.com/"));
        propagandaListVo.setSort(propaganda.getSort());
        propagandaListVo.setImage(propaganda.getImage());
        return propagandaListVo;
    }

    private PropagandaDetailVo assemblePropagandaDetailVo(Propaganda propaganda){
        PropagandaDetailVo propagandaDetailVo = new PropagandaDetailVo();
        propagandaDetailVo.setId(propaganda.getId());
        propagandaDetailVo.setName(propaganda.getName());
        propagandaDetailVo.setSort(propaganda.getSort());
        propagandaDetailVo.setImage(propaganda.getImage());
        propagandaDetailVo.setUrl(propaganda.getUrl());
        propagandaDetailVo.setmUrl(propaganda.getMUrl());

        propagandaDetailVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.epost.com/"));

        propagandaDetailVo.setCreateTime(DateTimeUtil.dateToStr(propaganda.getCreateTime()));
        propagandaDetailVo.setUpdateTime(DateTimeUtil.dateToStr(propaganda.getUpdateTime()));
        return propagandaDetailVo;
    }
}
