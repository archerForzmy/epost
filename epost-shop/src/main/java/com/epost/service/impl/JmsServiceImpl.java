package com.epost.service.impl;

import com.epost.service.IJmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.jms.Destination;

@Service("iJmsService")
public class JmsServiceImpl implements IJmsService {

    @Autowired
    private JmsTemplate jmsTemplate;
    @Resource
    @Qualifier("queueDestination")
    private Destination queueDestination;

    @Override
    public void sendMessage(Object msg) {
        //发送消息给消息中间件
        jmsTemplate.convertAndSend(queueDestination,msg);
    }
}
