package com.epost.controller.portal;

import com.epost.common.ServerResponse;
import com.epost.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/category")
@CrossOrigin(origins = "*")
public class CategoryController {
    @Autowired
    private ICategoryService iCategoryService;
    @RequestMapping(value="list.do",method = RequestMethod.POST)
    public ServerResponse<String> list() {
        return iCategoryService.getCategoryList();
    }
}
