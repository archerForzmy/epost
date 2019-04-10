package com.epost.service;

import com.epost.common.ServerResponse;
import com.epost.pojo.Product;
import com.epost.vo.CommentVo;
import com.epost.vo.ProductDetailVo;
import com.epost.vo.ProductListVo;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IProductService {
    ServerResponse saveOrUpdateProduct(Product product);

    ServerResponse<String> setSaleStatus(Integer productId,Integer status);

    ServerResponse<ProductDetailVo> manageProductDetail(Integer productId);

    ServerResponse<PageInfo> getProductList(int pageNum, int pageSize);

    ServerResponse<List<ProductListVo>> getProductList();

    ServerResponse<PageInfo> searchProduct(String productName,Integer productId,int pageNum,int pageSize);

    ServerResponse<ProductDetailVo> getProductDetail(Integer productId);

    ServerResponse<PageInfo> getProductByKeywordCategory(String keyword,Integer categoryId,int pageNum,int pageSize,String orderBy);

    void updateProductSolr(Product product);

    Product product(Integer productId);

    ServerResponse getProductComment(Integer productId, int pageNum, int pageSize);

    ServerResponse insertComment(Integer userId, CommentVo commentVo);
}
