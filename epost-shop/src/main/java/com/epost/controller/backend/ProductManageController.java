package com.epost.controller.backend;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.Product;
import com.epost.pojo.User;
import com.epost.service.IFileService;
import com.epost.service.IProductService;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.PropertiesUtil;
import com.epost.util.RedisShardedPoolUtil;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/manage/product")
@CrossOrigin(origins = "*")
public class ProductManageController {

    @Autowired
    private IUserService iUserService;
    @Autowired
    private IProductService iProductService;
    @Autowired
    private IFileService iFileService;

    //添加或者更新商品
    @RequestMapping(value = "save.do", method = RequestMethod.POST)
    public ServerResponse productSave(HttpServletRequest httpServletRequest, Product product) {
        //填充我们增加产品的业务逻辑
        return iProductService.saveOrUpdateProduct(product);
    }

    //商品上下架
    @RequestMapping(value = "set_sale_status.do", method = RequestMethod.POST)
    public ServerResponse setSaleStatus(HttpServletRequest httpServletRequest, Integer productId, Integer status) {
        return iProductService.setSaleStatus(productId, status);
    }

    //获取商品详情
    @RequestMapping(value = "detail.do", method = RequestMethod.POST)
    public ServerResponse getDetail(HttpServletRequest httpServletRequest, Integer productId) {
        //填充业务
        return iProductService.manageProductDetail(productId);
    }

    //获取所有商品列表
    @RequestMapping(value = "all.do", method = RequestMethod.POST)
    public ServerResponse getAll(HttpServletRequest httpServletRequest) {
        //填充业务
        return iProductService.getProductList();
    }

    //获取商品列表
    @RequestMapping(value = "list.do", method = RequestMethod.POST)
    public ServerResponse getList(HttpServletRequest httpServletRequest,
                                  @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        //填充业务
        return iProductService.getProductList(pageNum, pageSize);
    }

    //获取带条件商品列表
    @RequestMapping(value = "search.do", method = RequestMethod.POST)
    public ServerResponse productSearch(HttpServletRequest httpServletRequest, String productName, Integer productId,
                                        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        //填充业务
        return iProductService.searchProduct(productName, productId, pageNum, pageSize);
    }

    //上传商品图片
    @RequestMapping(value = "upload.do", method = RequestMethod.POST)
    public ServerResponse upload(HttpServletRequest httpServletRequest,
                                 @RequestParam(value = "upload_file", required = false) MultipartFile file, HttpServletRequest request) {
        String path = request.getSession().getServletContext().getRealPath("upload");
        String targetFileName = iFileService.upload(file, path);
        String url = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFileName;

        Map fileMap = Maps.newHashMap();
        fileMap.put("uri", targetFileName);
        fileMap.put("url", url);
        return ServerResponse.createBySuccess(fileMap);
    }

    //上传商品的文本中的图片（simditor控件内部调用的）
    @RequestMapping(value = "richtext_img_upload.do", method = RequestMethod.POST)
    public Map richtextImgUpload(@RequestParam(value = "upload_file", required = false)
            MultipartFile file, HttpServletRequest request, HttpServletResponse response) {
        Map resultMap = Maps.newHashMap();
        //富文本中对于返回值有自己的要求,我们使用是simditor所以按照simditor的要求进行返回
//        {
//            "success": true/false,
//                "msg": "error message", # optional
//            "file_path": "[real file path]"
//        }
        String path = request.getSession().getServletContext().getRealPath("upload");
        String targetFileName = iFileService.upload(file, path);
        if (StringUtils.isBlank(targetFileName)) {
            resultMap.put("success", false);
            resultMap.put("msg", "上传失败");
            return resultMap;
        }
        String url = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFileName;
        resultMap.put("success", true);
        resultMap.put("msg", "上传成功");
        resultMap.put("file_path", url);
        response.addHeader("Access-Control-Allow-Headers", "X-File-Name");
        return resultMap;
    }


}
