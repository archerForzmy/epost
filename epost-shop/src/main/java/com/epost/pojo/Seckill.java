package com.epost.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Seckill {
    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private Integer pid;
    private Date start;
    private Date end;
    private Date createTime;
    private Date updateTime;
}