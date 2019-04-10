package com.epost.service;

import com.epost.common.ServerResponse;
import com.epost.pojo.Category;

import java.util.List;

public interface ICategoryService {
    ServerResponse<String> addCategory(String categoryName, Integer parentId);

    ServerResponse<String> updateCategoryName(Integer categoryId,String categoryName);

    ServerResponse<List<Category>> getChildrenParallelCategory(Integer categoryId);

    ServerResponse<List<Integer>> selectCategoryAndChildrenById(Integer categoryId);

    ServerResponse<String> getCategoryList();
}
