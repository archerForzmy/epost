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
public class Propaganda {
    private Integer id;
    private String name;
    private String image;
    private String url;
    private String mUrl;
    private Integer sort;
    private Date createTime;
    private Date updateTime;
}