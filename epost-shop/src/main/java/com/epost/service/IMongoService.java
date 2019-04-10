package com.epost.service;

import com.epost.vo.CommentVo;

import java.util.List;
import java.util.Map;

public interface IMongoService {
    List queryForPageBySort(Integer pageSize, Integer pageNum, Class<?> commentVoClass, String sort, String key, Object value);

    <T> void addData(T t);

    <T> void addData(T t,String collectionName);

    Long queryCount(String key, Object value, Class<CommentVo> className);

    Long queryCount(Map<String,Object> params, Class className);

    List<Map> query(Map<String,Object> params,String collectionName);
}
