package com.epost.service.impl;

import com.epost.service.IMongoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("iMongoService")
public class MongoServiceImpl implements IMongoService {
    @Autowired
    private MongoTemplate mongoTemplate;

    //插入数据
    public <T> void addData(T data){
        mongoTemplate.insert(data);
    }

    //插入数据
    public <T> void addData(T data,String collectionName){
        mongoTemplate.insert(data,collectionName);
    }

    //分页排序查询
    public List queryForPageBySort(Integer pageSize,Integer pageNum,Class<?> className,String sort,String key,Object value){
        Query query = new Query();
        //添加条件
        Criteria criteria = Criteria.where(key).is(value);
        query.addCriteria(criteria);
        //排序
        query.with(new Sort(Sort.Direction.ASC, sort));
        //添加分页条件
        query.with(new PageRequest(pageNum, pageSize));
        return mongoTemplate.find(query,className);
    }

    //查询key的数量
    public Long queryCount(String key,Object value,Class className){
        Query query = new Query();
        Criteria criteria = Criteria.where(key).is(value);
        query.addCriteria(criteria);
        return mongoTemplate.count(query,className);
    }

    //查询是否存在
    public Long queryCount(Map<String,Object> params, Class className){
        Query query = new Query();
        for(Map.Entry<String,Object> entry:params.entrySet()){
            Criteria criteria = Criteria.where(entry.getKey()).is(entry.getValue());
            query.addCriteria(criteria);
        }
        return mongoTemplate.count(query,className);
    }

    public List<Map> query(Map<String,Object> params,String collectionName){
        Query query = new Query();
        for(Map.Entry<String,Object> entry:params.entrySet()){
            Criteria criteria = Criteria.where(entry.getKey()).is(entry.getValue());
            query.addCriteria(criteria);
        }
        return mongoTemplate.find(query,Map.class,collectionName);
    }

}
