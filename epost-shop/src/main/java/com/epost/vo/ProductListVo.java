package com.epost.vo;

import org.apache.solr.client.solrj.beans.Field;

import java.io.Serializable;
import java.math.BigDecimal;

public class ProductListVo implements Serializable {
    @Field
    private Integer id;
    @Field("category_id")
    private Integer categoryId;
    @Field("pname")
    private String name;
    @Field("subtitle")
    private String subtitle;
    @Field("main_image")
    private String mainImage;
    @Field("price_solr")
    private Double priceSolr;
    private BigDecimal price;
    @Field("status")
    private Integer status;
    @Field("volume_solr")
    private Integer volume;
    @Field("comment_solr")
    private Integer comment;
    @Field("image_host")
    private String imageHost;


    public Integer getVolume() {
        return volume;
    }

    public void setVolume(Integer volume) {
        this.volume = volume;
    }

    public Integer getComment() {
        return comment;
    }

    public void setComment(Integer comment) {
        this.comment = comment;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        this.priceSolr = price.doubleValue();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getImageHost() {
        return imageHost;
    }

    public void setImageHost(String imageHost) {
        this.imageHost = imageHost;
    }

    public Double getPriceSolr() {
        return priceSolr;
    }
    //solr中取出的值要设置给price
    public void setPriceSolr(Double priceSolr) {
        this.priceSolr = priceSolr;
        this.price = new BigDecimal(priceSolr);
    }

}
