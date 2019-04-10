package com.epost.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component    //将这个对象注入到spring 容器中否则全局异常处理不会生效
public class ExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                         Object o, Exception e) {
        log.error("{} Exception",httpServletRequest.getRequestURI(),e);
        //将ModelAndView对象转换成json形式否则会进行页面跳转
        ModelAndView modelAndView = new ModelAndView(new MappingJackson2JsonView());

        //当使用是jackson2.x的时候使用MappingJackson2JsonView，课程中使用的是1.9。
        modelAndView.addObject("status",ResponseCode.ERROR.getCode());
        modelAndView.addObject("msg","接口异常,详情请查看服务端日志的异常信息");
        modelAndView.addObject("data",e.toString());
        return modelAndView;
    }
}
