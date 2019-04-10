package com.epost.mq;

import com.epost.pojo.Product;
import com.epost.service.IProductService;
import com.epost.service.impl.SolrService;
import com.epost.util.JsonUtil;
import com.epost.util.RedisShardedPoolUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Resource;
import javax.jms.Message;
import javax.jms.MessageListener;
import org.apache.activemq.command.ActiveMQObjectMessage;

@Slf4j
public class UpdateProductListener implements MessageListener {

    @Autowired
    SolrService solrService;
    @Resource
    IProductService productService;

    @Override
    public void onMessage(Message message) {
        //获取pid查询出商品更新到索引库中
        ActiveMQObjectMessage msg = (ActiveMQObjectMessage) message;
        try {
            Integer productId =  (Integer)msg.getObject();
            //删除原先的数据
            RedisShardedPoolUtil.del("product_"+productId);
            Product product =  productService.product(productId);
            //更新缓存
            RedisShardedPoolUtil.set("product_"+product.getId(),JsonUtil.obj2String(product));
            //更新索引库
            productService.updateProductSolr(product);
        } catch (Exception e) {
            log.info(e.getMessage());
        }

    }
}
