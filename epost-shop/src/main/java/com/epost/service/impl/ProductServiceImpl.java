package com.epost.service.impl;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.dao.CategoryMapper;
import com.epost.dao.OrderItemMapper;
import com.epost.dao.ProductMapper;
import com.epost.pojo.Category;
import com.epost.pojo.Product;
import com.epost.service.*;
import com.epost.util.DateTimeUtil;
import com.epost.util.JsonUtil;
import com.epost.util.PropertiesUtil;
import com.epost.util.RedisShardedPoolUtil;
import com.epost.vo.CommentPageVo;
import com.epost.vo.CommentVo;
import com.epost.vo.ProductDetailVo;
import com.epost.vo.ProductListVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("iProductService")
@Slf4j
public class ProductServiceImpl implements IProductService {
    @Resource
    private ProductMapper productMapper;
    @Resource
    private CategoryMapper categoryMapper;
    @Resource
    private OrderItemMapper orderItemMapper;

    @Autowired
    private ICategoryService iCategoryService;
    @Autowired
    private ISolrService iSolrService;
    @Autowired
    private IJmsService iJmsService;
    @Autowired
    private IMongoService iMongoService;
    //添加或者更新方法
    @Override
    public ServerResponse saveOrUpdateProduct(Product product){
        if(product != null) {
            //设置商品的主图片
            if (StringUtils.isNotBlank(product.getSubImages())) {
                String[] subImageArray = product.getSubImages().split(",");
                if (subImageArray.length > 0) {
                    product.setMainImage(subImageArray[0]);
                }
            }
            //判断是更新还是添加商品
            if (product.getId() != null) {
                int rowCount = productMapper.updateByPrimaryKeySelective(product);
                if (rowCount > 0) {
                    //发送消息更新索引库
                    iJmsService.sendMessage(product.getId());
                    return ServerResponse.createBySuccess("更新产品成功");
                }
                return ServerResponse.createByErrorMessage("更新产品失败");
            } else {
                int rowCount = productMapper.insert(product);
                if (rowCount > 0) {
                    //更新到搜索引擎上
                    updateProductSolr(product);
                    return ServerResponse.createBySuccess("新增产品成功");
                }
                return ServerResponse.createByErrorMessage("新增产品失败");
            }
        }
        return ServerResponse.createByErrorMessage("新增或更新产品参数不正确");
    }

    // 商品上下架
    @Override
    public ServerResponse<String> setSaleStatus(Integer productId, Integer status) {
        //判断参数是否异常
        if(productId == null || status == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        Product product = new Product();
        product.setId(productId);
        product.setStatus(status);
        int rowCount = productMapper.updateByPrimaryKeySelective(product);
        if(rowCount > 0){
            //发送消息更新索引库
            iJmsService.sendMessage(product.getId());
            return ServerResponse.createBySuccess("修改产品销售状态成功");
        }
        return ServerResponse.createByErrorMessage("修改产品销售状态失败");
    }

    //根据id获取商品的详情数据
    @Override
    public ServerResponse<ProductDetailVo> manageProductDetail(Integer productId) {
        if(productId == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        Product product = product(productId);
        if(product == null){
            return ServerResponse.createByErrorMessage("产品已下架或者删除");
        }
        ProductDetailVo productDetailVo = assembleProductDetailVo(product);
        return ServerResponse.createBySuccess(productDetailVo);
    }

    //分页查询商品列表
    @Override
    public ServerResponse<PageInfo> getProductList(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<Product> productList = productMapper.selectList();

        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product productItem : productList){
            ProductListVo productListVo = assembleProductListVo(productItem);
            productListVoList.add(productListVo);
        }
        PageInfo pageResult = new PageInfo(productList);
        pageResult.setList(productListVoList);
        return ServerResponse.createBySuccess(pageResult);
    }

    //获取所有商品
    @Override
    public ServerResponse<List<ProductListVo>> getProductList() {
        List<Product> productList = productMapper.selectAllByStatus();

        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product productItem : productList){
            ProductListVo productListVo = assembleProductListVo(productItem);
            productListVoList.add(productListVo);
        }
        return ServerResponse.createBySuccess(productListVoList);
    }

    //分页查询带条件的商品列表（id，商品名称）
    @Override
    public ServerResponse<PageInfo> searchProduct(String productName, Integer productId, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        if(StringUtils.isNotBlank(productName)){
            productName = new StringBuilder().append("%").append(productName).append("%").toString();
        }
        List<Product> productList = productMapper.selectByNameAndProductId(productName,productId);
        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product productItem : productList){
            ProductListVo productListVo = assembleProductListVo(productItem);
            productListVoList.add(productListVo);
        }
        PageInfo pageResult = new PageInfo(productList);
        pageResult.setList(productListVoList);
        return ServerResponse.createBySuccess(pageResult);
    }

    //前台获取商品详情方法
    @Override
    public ServerResponse<ProductDetailVo> getProductDetail(Integer productId) {
        if(productId == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        Product product = product(productId);
        if(product == null){
            return ServerResponse.createByErrorMessage("产品已下架或者删除");
        }
        if(product.getStatus() != Const.ProductStatusEnum.ON_SALE.getCode()){
            return ServerResponse.createByErrorMessage("产品已下架或者删除");
        }
        ProductDetailVo productDetailVo = assembleProductDetailVo(product);
        return ServerResponse.createBySuccess(productDetailVo);
    }

    //前台检索商品
    @Override
    public ServerResponse<PageInfo> getProductByKeywordCategory(String keyword, Integer categoryId, int pageNum, int pageSize, String orderBy) {
        if(StringUtils.isBlank(keyword) && categoryId == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        List<Integer> categoryIdList = new ArrayList<Integer>();

        if(categoryId != null){
            Category category = categoryMapper.selectByPrimaryKey(categoryId);
            if(category == null && StringUtils.isBlank(keyword)){
                //没有该分类,并且还没有关键字,这个时候返回一个空的结果集,不报错
                PageHelper.startPage(pageNum,pageSize);
                List<ProductListVo> productListVoList = Lists.newArrayList();
                PageInfo pageInfo = new PageInfo(productListVoList);
                return ServerResponse.createBySuccess(pageInfo);
            }
            //获取分类id和子分类id(递归)
            categoryIdList = iCategoryService.selectCategoryAndChildrenById(category.getId()).getData();
        }
        PageHelper.startPage(pageNum,pageSize);
        //从索引库中取出值
        List<ProductListVo> productListVos = iSolrService.searchByPage(keyword,categoryIdList,pageNum-1,pageSize,orderBy);
        PageInfo pageInfo = new PageInfo(productListVos);
        return ServerResponse.createBySuccess(pageInfo);
    }

    //更新数据到索引库
    @Override
    public void updateProductSolr(Product product){
        iSolrService.saveProduct(assembleProductListVo(product));
    }

    //通过id查询出来商品
    @Override
    public Product product(Integer productId){
        if(productId==null){
            return null;
        }
        Product product = null;
        //从缓存中取出数据
        String result = RedisShardedPoolUtil.get("product_"+productId);
        if(StringUtils.equals("非法商品",result)){
            return null;
        }else if(result ==null){
            product = productMapper.selectByPrimaryKey(productId);
            if(product==null){
                //没有这个商品
                RedisShardedPoolUtil.set("product_" + productId, "非法商品");
                return null;
            }else {
                result = JsonUtil.obj2String(product);
                //保存数据到缓存
                RedisShardedPoolUtil.set("product_" + product.getId(), result);
            }
        }
        product = JsonUtil.string2Obj(result,Product.class);
        return product;
    }


    private ProductDetailVo assembleProductDetailVo(Product product){
        ProductDetailVo productDetailVo = new ProductDetailVo();
        productDetailVo.setId(product.getId());
        productDetailVo.setSubtitle(product.getSubtitle());
        productDetailVo.setPrice(product.getPrice());
        productDetailVo.setMainImage(product.getMainImage());
        productDetailVo.setSubImages(product.getSubImages());
        productDetailVo.setCategoryId(product.getCategoryId());
        productDetailVo.setDetail(product.getDetail());
        productDetailVo.setName(product.getName());
        productDetailVo.setStatus(product.getStatus());
        productDetailVo.setStock(product.getStock());
        productDetailVo.setVolume(product.getVolume());
        productDetailVo.setComment(product.getComment());

        productDetailVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.epost.com/"));
        Category category = categoryMapper.selectByPrimaryKey(product.getCategoryId());
        if(category == null){
            productDetailVo.setParentCategoryId(0);//默认根节点
        }else{
            productDetailVo.setParentCategoryId(category.getParentId());
        }
        productDetailVo.setCreateTime(DateTimeUtil.dateToStr(product.getCreateTime()));
        productDetailVo.setUpdateTime(DateTimeUtil.dateToStr(product.getUpdateTime()));
        return productDetailVo;
    }

    private ProductListVo assembleProductListVo(Product product){
        ProductListVo productListVo = new ProductListVo();
        productListVo.setId(product.getId());
        productListVo.setName(product.getName());
        productListVo.setCategoryId(product.getCategoryId());
        productListVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix","http://img.happymmall.com/"));
        productListVo.setMainImage(product.getMainImage());
        productListVo.setPrice(product.getPrice());
        productListVo.setSubtitle(product.getSubtitle());
        productListVo.setStatus(product.getStatus());
        productListVo.setVolume(product.getVolume());
        productListVo.setComment(product.getComment());
        return productListVo;
    }

    //分页评论对象
    private CommentPageVo assembleCommentPageVo(List<CommentVo> list,
                                                int pageNum,int pageSize,int pageIndex,
                                                int count,int start ,int end,
                                                boolean hasPre,boolean hasNext){
        CommentPageVo commentPageVo = new CommentPageVo();
        commentPageVo.setList(list);
        commentPageVo.setPageNum(pageNum);
        commentPageVo.setPageIndex(pageIndex);
        commentPageVo.setPageSize(pageSize);
        commentPageVo.setCount(count);
        commentPageVo.setStart(start);
        commentPageVo.setEnd(end);
        commentPageVo.setHasPre(hasPre);
        commentPageVo.setHasNext(hasNext);
        return commentPageVo;

    }
    //分页获取商品评论
    @Override
    public ServerResponse getProductComment(Integer productId, int pageNum, int pageSize) {
        List<CommentVo> commentVoList =  iMongoService.queryForPageBySort(pageSize,
                pageNum,
                CommentVo.class,
                "createTime",
                "productId",
                productId);
        int count = iMongoService.queryCount("productId",productId,CommentVo.class).intValue();
        int pageIndex = (count%pageSize)==0 ?(count/pageSize):(count/pageSize)+1;
        int start =0;
        int end = 0;
        boolean hasPre = (pageNum+1>1);
        boolean hasNext = (pageNum+1<pageIndex);
        if(pageIndex<5){
            start = 1;
            end = pageIndex;
        }else{
            start = pageNum-2<0?1:pageNum-2;
            end = pageNum+2>pageIndex?pageIndex:pageNum+2;
        }
        return ServerResponse.createBySuccess(assembleCommentPageVo(commentVoList,pageNum+1,pageSize
                ,pageIndex,count,start,end,hasPre,hasNext));
    }

    //插入一个评论记录
    @Override
    public ServerResponse insertComment(Integer userId,CommentVo commentVo){
        if(commentVo==null){
            return ServerResponse.createByErrorMessage("评论失败");
        }
        Map<String,Object> params = new HashMap<String,Object>();
        params.put("username",commentVo.getUsername());
        params.put("productId",commentVo.getProductId());
        if(iMongoService.queryCount(params,CommentVo.class)>0){
            return ServerResponse.createByErrorMessage("您已经评价过了");
        }
        int row = orderItemMapper.getOrderByUserIdAndProductId(commentVo.getProductId(),userId);
        if(row<=0){
            return ServerResponse.createByErrorMessage("您还没购买过这个商品");
        }
        iMongoService.addData(commentVo);
        //更新商品的评论量
        Product product = product(commentVo.getProductId());
        product.setComment(product.getComment()+1);
        productMapper.updateByPrimaryKeySelective(product);
        //更新缓存和索引库
        iJmsService.sendMessage(product.getId());
        return ServerResponse.createBySuccess("评论成功");
    }
}
