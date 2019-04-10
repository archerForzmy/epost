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
public class SeckillOrder {
    private Integer id;
    private Integer userId;
    private Integer seckillId;
    private Long orderNo;
    private Date createTime;
    private Date updateTime;

}