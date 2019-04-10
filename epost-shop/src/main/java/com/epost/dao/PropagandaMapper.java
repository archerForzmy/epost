package com.epost.dao;

import com.epost.pojo.Propaganda;

import java.util.List;

public interface PropagandaMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Propaganda record);

    int insertSelective(Propaganda record);

    Propaganda selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Propaganda record);

    int updateByPrimaryKey(Propaganda record);

    //根据名称获取广告
    List<Propaganda> selectByName(String propagandaName);
    //获取广告列表
    List<Propaganda> selectList();
    //获取首页轮播图
    List<Propaganda> selectListBySort();
}