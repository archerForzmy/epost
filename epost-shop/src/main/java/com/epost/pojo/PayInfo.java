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
public class PayInfo {
    private Integer id;
    private Integer userId;
    private Long orderNo;
    private Integer payPlatform;
    private String platformNumber;
    private String platformStatus;
    private Date createTime;
    private Date updateTime;
}