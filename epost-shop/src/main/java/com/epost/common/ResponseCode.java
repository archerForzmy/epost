package com.epost.common;

//响应状态定义
public enum ResponseCode {

    SUCCESS(0,"SUCCESS"),                       //成功
    ERROR(1,"ERROR"),                           //错误
    NEED_LOGIN(10,"NEED_LOGIN"),                //没有登录
    ILLEGAL_ARGUMENT(2,"ILLEGAL_ARGUMENT");     //参数错误

    private final int code;
    private final String desc;

    ResponseCode(int code,String desc){
        this.code = code;
        this.desc = desc;
    }

    public int getCode(){
        return code;
    }
    public String getDesc(){
        return desc;
    }

}
