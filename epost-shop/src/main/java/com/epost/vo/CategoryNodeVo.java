package com.epost.vo;

import java.util.List;

public class CategoryNodeVo {
    private Integer id;
    private String name;
    private List<CategoryNodeVo> categoryNodeVoList;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CategoryNodeVo> getCategoryNodeVoList() {
        return categoryNodeVoList;
    }

    public void setCategoryNodeVoList(List<CategoryNodeVo> categoryNodeVoList) {
        this.categoryNodeVoList = categoryNodeVoList;
    }
}
