package com.epost.vo;

import java.math.BigDecimal;

public class SeckillOrderVo {
    private Integer seckillId;
    private BigDecimal totalPrice;
    private String seckillName;
    private String productImage;
    private BigDecimal currentUnitPrice;
    private BigDecimal currentUnitSeckillPrice;
    private Integer quantity;

    private String imageHost;

    public BigDecimal getCurrentUnitSeckillPrice() {
        return currentUnitSeckillPrice;
    }

    public void setCurrentUnitSeckillPrice(BigDecimal currentUnitSeckillPrice) {
        this.currentUnitSeckillPrice = currentUnitSeckillPrice;
    }

    public Integer getSeckillId() {
        return seckillId;
    }

    public void setSeckillId(Integer seckillId) {
        this.seckillId = seckillId;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getSeckillName() {
        return seckillName;
    }

    public void setSeckillName(String seckillName) {
        this.seckillName = seckillName;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public BigDecimal getCurrentUnitPrice() {
        return currentUnitPrice;
    }

    public void setCurrentUnitPrice(BigDecimal currentUnitPrice) {
        this.currentUnitPrice = currentUnitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageHost() {
        return imageHost;
    }

    public void setImageHost(String imageHost) {
        this.imageHost = imageHost;
    }
}
