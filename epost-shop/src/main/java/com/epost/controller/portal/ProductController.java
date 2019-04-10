package com.epost.controller.portal;

import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.IProductService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import com.epost.vo.CommentVo;
import com.epost.vo.ProductDetailVo;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/product/")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private IProductService iProductService;

    //返回商品详情页数据
    @RequestMapping(value="detail.do",method = RequestMethod.POST)
    public ServerResponse<ProductDetailVo> detail(Integer productId){
        return iProductService.getProductDetail(productId);
    }

    //前台搜索商品
    @RequestMapping(value="list.do",method = RequestMethod.POST)
    public ServerResponse<PageInfo> list(@RequestParam(value = "keyword",required = false)String keyword,
                                         @RequestParam(value = "categoryId",required = false)Integer categoryId,
                                         @RequestParam(value = "pageNum",defaultValue = "1") int pageNum,
                                         @RequestParam(value = "pageSize",defaultValue = "10") int pageSize,
                                         @RequestParam(value = "orderBy",defaultValue = "") String orderBy){
        return iProductService.getProductByKeywordCategory(keyword,categoryId,pageNum,pageSize,orderBy);
    }

    //返回商品评论
    @RequestMapping(value="comments.do",method = RequestMethod.POST)
    public ServerResponse<List<CommentVo>> comments(@RequestParam(value = "productId") Integer productId,
                                                    @RequestParam(value = "pageNum",defaultValue = "1") int pageNum,
                                                    @RequestParam(value = "pageSize",defaultValue = "10") int pageSize){
        return iProductService.getProductComment(productId,pageNum,pageSize);
    }

    //评论商品
    @RequestMapping(value="comment.do",method = RequestMethod.POST)
    public ServerResponse comment(CommentVo commentVo,HttpServletRequest request){
        String loginToken = CookieUtil.readLoginToken(request);
        if(StringUtils.isEmpty(loginToken)){
            return ServerResponse.createByErrorMessage("用户未登录,无法获取当前用户的信息");
        }
        String userJsonStr = RedisShardedPoolUtil.get(loginToken);
        User user = JsonUtil.string2Obj(userJsonStr,User.class);
        if (user == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(), ResponseCode.NEED_LOGIN.getDesc());
        }
        commentVo.setUsername(user.getUsername());
        return iProductService.insertComment(user.getId(),commentVo);
    }

    //日期转换（spring mvc字符串转date类型）
    @InitBinder
    public void initBinder(ServletRequestDataBinder bin) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        CustomDateEditor cust = new CustomDateEditor(sdf, true);
        bin.registerCustomEditor(Date.class, cust);
    }
}
