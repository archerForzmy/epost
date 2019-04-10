package com.epost.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Cart {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private Integer quantity;
    private Integer checked;
    private Date createTime;
    private Date updateTime;

}