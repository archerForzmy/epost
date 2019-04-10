package com.epost.service.impl;

import com.epost.common.Const;
import com.epost.service.ISolrService;
import com.epost.vo.ProductListVo;
import com.github.pagehelper.PageHelper;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.Query;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.data.solr.core.query.result.ScoredPage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("iSolrService")
@Slf4j
public class SolrService implements ISolrService {
    @Autowired
    SolrTemplate solrTemplate;

    //将商品更新到solr库中
    @Override
    public void saveProduct(ProductListVo product){
        List<ProductListVo> productListVoList =  Lists.newArrayList();
        productListVoList.add(product);
        solrTemplate.saveBeans(productListVoList);
        solrTemplate.commit();
    }

    /**
     * 按照主键查询
     * @param id
     * @return
     */
    public ProductListVo searchById(int id) {
        ProductListVo product = solrTemplate.getById(id, ProductListVo.class);
        return product;
    }

    /**
     * 按条件分页查询
     * @param keyword
     * @param categoryIdList
     * @param pageNum
     * @param pageSize
     * @param orderBy
     * @return
     */
    public List<ProductListVo> searchByPage(String keyword, List<Integer> categoryIdList,
                                            int pageNum, int pageSize, String orderBy){
        //设置查询条件(在售商品)
        Query query = new SimpleQuery("status:1");
        //设置关键子查询条件
        Criteria criteria = null;
        if(StringUtils.isNotBlank(keyword)) {
            criteria =new Criteria("pname").is(keyword)
                    .or("subtitle").is(keyword);
            query.addCriteria(criteria);
        }
        if(categoryIdList.size()>0){
            criteria =new Criteria("category_id").is(categoryIdList);
            query.addCriteria(criteria);
        }
        //设置分页条件
        query.setOffset(pageNum);
        query.setRows(pageSize);
        //设置排序
        if(StringUtils.isNotBlank(orderBy)
                && Const.ProductListOrderBy.PRICE_ASC_DESC.contains(orderBy)){
            String[] orderByArray = orderBy.split("_");
            if("asc".equals(orderByArray[1])) {
                query.addSort(new Sort(Sort.Direction.ASC, orderByArray[0] + "_solr"));
            }else{
                query.addSort(new Sort(Sort.Direction.DESC, orderByArray[0] + "_solr"));
            }
        }
        //开始查询
        ScoredPage<ProductListVo> page =  solrTemplate.queryForPage(query,ProductListVo.class);
        return page.getContent();
    }

}
