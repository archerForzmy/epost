package com.epost.controller.backend;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.pojo.User;
import com.epost.service.ICategoryService;
import com.epost.service.IUserService;
import com.epost.util.CookieUtil;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/manage/category")
@CrossOrigin(origins = "*")
public class CategoryManageController {
    @Autowired
    private IUserService iUserService;
    @Autowired
    private ICategoryService iCategoryService;

    //添加父类，如果没有传入parentId就表示添加一级分类
    @RequestMapping(value="add_category.do",method = RequestMethod.POST)
    public ServerResponse<String> addCategory(HttpServletRequest httpServletRequest, String categoryName,
                                              @RequestParam(value = "parentId", defaultValue = "0") int parentId) {
        return iCategoryService.addCategory(categoryName, parentId);
    }

    //修改分类名
    @RequestMapping(value="set_category_name.do",method = RequestMethod.POST)
    public ServerResponse setCategoryName(HttpServletRequest httpServletRequest, Integer categoryId, String categoryName) {
        //更新categoryName
        return iCategoryService.updateCategoryName(categoryId, categoryName);
    }
    //获取子分类列表
    @RequestMapping(value="get_category.do",method = RequestMethod.POST)
    public ServerResponse getChildrenParallelCategory(HttpServletRequest httpServletRequest,
                                                      @RequestParam(value = "categoryId", defaultValue = "0") Integer categoryId) {
        //查询子节点的category信息,并且不递归,保持平级
        return iCategoryService.getChildrenParallelCategory(categoryId);
    }

    @RequestMapping(value="get_deep_category.do",method = RequestMethod.POST)
    public ServerResponse getCategoryAndDeepChildrenCategory(HttpServletRequest httpServletRequest,
                                                             @RequestParam(value = "categoryId", defaultValue = "0") Integer categoryId) {
        //查询当前节点的id和递归子节点的id
        //0->10000->100000
        return iCategoryService.selectCategoryAndChildrenById(categoryId);
    }


}
