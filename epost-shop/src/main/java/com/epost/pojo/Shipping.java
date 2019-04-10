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
public class Shipping {
    private Integer id;
    private Integer userId;
    private String receiverName;
    private String receiverPhone;
    private String receiverMobile;
    private String receiverProvince;
    private String receiverCity;
    private String receiverDistrict;
    private String receiverAddress;
    private String receiverZip;
    private Date createTime;
    private Date updateTime;
}