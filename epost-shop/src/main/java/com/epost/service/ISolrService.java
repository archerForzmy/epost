package com.epost.service;

import com.epost.vo.ProductListVo;

import java.util.List;

public interface ISolrService {
    public void saveProduct(ProductListVo product);

    public ProductListVo searchById(int id);

    public List<ProductListVo> searchByPage(String keyword, List<Integer> categoryIdList, int pageNum, int pageSize, String orderBy);
}
