package com.epost.pojo;

import lombok.*;

import java.util.Date;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of="id")
@ToString
public class Category {
    private Integer id;
    private Integer parentId;
    private String name;
    private Boolean status;
    private Integer sortOrder;
    private Date createTime;
    private Date updateTime;
}