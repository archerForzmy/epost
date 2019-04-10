package com.epost.service.impl;

import com.epost.common.Const;
import com.epost.common.ResponseCode;
import com.epost.common.ServerResponse;
import com.epost.common.TokenCache;
import com.epost.dao.UserMapper;
import com.epost.pojo.User;
import com.epost.service.IUserService;
import com.epost.util.MD5Util;
import com.epost.util.RedisShardedPoolUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service("iUserService")
@Slf4j
public class UserServiceImpl implements IUserService {
    @Resource
    private UserMapper userMapper;

    @Override
    public ServerResponse<User> login(String username, String password) {
        int resultCount = userMapper.checkUsername(username);
        if(resultCount == 0 ){
            return ServerResponse.createByErrorMessage("用户名不存在");
        }
        //密码加密验证
        String md5Password = MD5Util.MD5EncodeUtf8(password);
        User user  = userMapper.selectLogin(username,md5Password);
        if(user == null){
            return ServerResponse.createByErrorMessage("密码错误");
        }

        user.setPassword(org.apache.commons.lang3.StringUtils.EMPTY);
        return ServerResponse.createBySuccess("登录成功",user);
    }
    //注册
    @Override
    public ServerResponse<String> register(User user) {
        //校验用户名是否存在
        ServerResponse validResponse = this.checkValid(user.getUsername(),Const.USERNAME);
        if(!validResponse.isSuccess()){
            return validResponse;
        }
        //校验用户邮箱是否被注册
        validResponse = this.checkValid(user.getEmail(),Const.EMAIL);
        if(!validResponse.isSuccess()){
            return validResponse;
        }
        //一般用户注册
        user.setRole(Const.Role.ROLE_CUSTOMER);
        //MD5加密
        user.setPassword(MD5Util.MD5EncodeUtf8(user.getPassword()));
        int resultCount = userMapper.insert(user);
        if(resultCount == 0){
            return ServerResponse.createByErrorMessage("注册失败");
        }
        return ServerResponse.createBySuccessMessage("注册成功");
    }
    //检查用户是否合法（邮箱或者用户名）
    @Override
    public ServerResponse<String> checkValid(String str,String type){
        if(org.apache.commons.lang3.StringUtils.isNotBlank(type)){
            //开始校验
            if(Const.USERNAME.equals(type)){
                int resultCount = userMapper.checkUsername(str);
                if(resultCount > 0 ){
                    return ServerResponse.createByErrorMessage("用户名已存在");
                }
            }
            if(Const.EMAIL.equals(type)){
                int resultCount = userMapper.checkEmail(str);
                if(resultCount > 0 ){
                    return ServerResponse.createByErrorMessage("email已存在");
                }
            }
        }else{
            return ServerResponse.createByErrorMessage("参数错误");
        }
        return ServerResponse.createBySuccessMessage("校验成功");
    }

    //获取提示问题
    @Override
    public ServerResponse<String> selectQuestion(String username){

        ServerResponse validResponse = this.checkValid(username,Const.USERNAME);
        if(validResponse.isSuccess()){
            //用户不存在
            return ServerResponse.createByErrorMessage("用户不存在");
        }
        String question = userMapper.selectQuestionByUsername(username);
        if(org.apache.commons.lang3.StringUtils.isNotBlank(question)){
            return ServerResponse.createBySuccess(question);
        }
        return ServerResponse.createByErrorMessage("找回密码的问题是空的");
    }

    //校验提示问题答案（如果回答正确就会返回token便于重置密码用的）
    @Override
    public ServerResponse<String> checkAnswer(String username,String question,String answer){
        int resultCount = userMapper.checkAnswer(username,question,answer);
        if(resultCount>0){
            //说明问题及问题答案是这个用户的,并且是正确的(重置密码必须带着forgetToken)
            String forgetToken = UUID.randomUUID().toString();
            //TokenCache.setKey(TokenCache.TOKEN_PREFIX+username,forgetToken);
            RedisShardedPoolUtil.setEx(Const.TOKEN_PREFIX+username,forgetToken,60*60*12);
            return ServerResponse.createBySuccess(forgetToken);
        }
        return ServerResponse.createByErrorMessage("问题的答案错误");
    }

    // 忘记密码重置
    @Override
    public ServerResponse<String> forgetResetPassword(String username,String passwordNew,String forgetToken){
        //没有token非法重置
        if(org.apache.commons.lang3.StringUtils.isBlank(forgetToken)){
            return ServerResponse.createByErrorMessage("参数错误,token需要传递");
        }
        //判断用户是否存在
        ServerResponse validResponse = this.checkValid(username,Const.USERNAME);
        if(validResponse.isSuccess()){
            //用户不存在
            return ServerResponse.createByErrorMessage("用户不存在");
        }
        //对比缓存中的token是否一致或者不为空
        //String token = TokenCache.getKey(TokenCache.TOKEN_PREFIX+username);
        String token = RedisShardedPoolUtil.get(Const.TOKEN_PREFIX+username);
        if(org.apache.commons.lang3.StringUtils.isBlank(token)){
            return ServerResponse.createByErrorMessage("token无效或者过期");
        }
        if(org.apache.commons.lang3.StringUtils.equals(forgetToken,token)){
            String md5Password  = MD5Util.MD5EncodeUtf8(passwordNew);
            //更新密码
            int rowCount = userMapper.updatePasswordByUsername(username,md5Password);
            if(rowCount > 0){
                return ServerResponse.createBySuccessMessage("修改密码成功");
            }
        }else{
            return ServerResponse.createByErrorMessage("token错误,请重新获取重置密码的token");
        }
        return ServerResponse.createByErrorMessage("修改密码失败");
    }

    //用户修改密码
    @Override
    public ServerResponse<String> resetPassword(String passwordOld,String passwordNew,User user){
        //防止横向越权,要校验一下这个用户的旧密码,一定要指定是这个用户.因为我们会查询一个count(1),如果不指定id,那么结果就是true啦count>0;
        int resultCount = userMapper.checkPassword(MD5Util.MD5EncodeUtf8(passwordOld),user.getId());
        if(resultCount == 0){
            return ServerResponse.createByErrorMessage("旧密码错误");
        }
        //设置新密码
        user.setPassword(MD5Util.MD5EncodeUtf8(passwordNew));
        int updateCount = userMapper.updateByPrimaryKeySelective(user);
        if(updateCount > 0){
            return ServerResponse.createBySuccessMessage("密码更新成功");
        }
        return ServerResponse.createByErrorMessage("密码更新失败");
    }

    //更新用户信息
    @Override
    public ServerResponse<User> updateInformation(User user){
        //username是不能被更新的
        //email也要进行一个校验,校验新的email是不是已经存在,并且存在的email如果相同的话,不能是我们当前的这个用户的.
        int resultCount = userMapper.checkEmailByUserId(user.getEmail(),user.getId());
        if(resultCount > 0){
            return ServerResponse.createByErrorMessage("email已存在,请更换email再尝试更新");
        }
        User updateUser = new User();
        updateUser.setId(user.getId());
        updateUser.setEmail(user.getEmail());
        updateUser.setPhone(user.getPhone());
        updateUser.setQuestion(user.getQuestion());
        updateUser.setAnswer(user.getAnswer());

        int updateCount = userMapper.updateByPrimaryKeySelective(updateUser);
        if(updateCount > 0){
            return ServerResponse.createBySuccess("更新个人信息成功",updateUser);
        }
        return ServerResponse.createByErrorMessage("更新个人信息失败");
    }

    //获取用户信息
    @Override
    public ServerResponse<User> getInformation(Integer userId){
        User user = userMapper.selectByPrimaryKey(userId);
        if(user == null){
            return ServerResponse.createByErrorMessage("找不到当前用户");
        }
        user.setPassword(org.apache.commons.lang3.StringUtils.EMPTY);
        return ServerResponse.createBySuccess(user);
    }

    /**
     * 校验是否是管理员
     * @param user
     * @return
     */
    public ServerResponse checkAdminRole(User user){
        if(user != null && user.getRole().intValue() == Const.Role.ROLE_ADMIN){
            return ServerResponse.createBySuccess();
        }
        return ServerResponse.createByError();
    }

    //获取用户列表
    @Override
    public ServerResponse<PageInfo> getUserList(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<User> userList = userMapper.selectUserList();
        PageInfo pageResult = new PageInfo(userList);
        return ServerResponse.createBySuccess(pageResult);
    }

    //用户枷锁解锁方法
    @Override
    public ServerResponse setlock(Integer userId, Integer lock) {
        //判断参数是否异常
        if(userId == null || lock == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(),ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        User user = new User();
        user.setId(userId);
        user.setLock(lock);
        int rowCount = userMapper.updateByPrimaryKeySelective(user);
        if(rowCount > 0){
            return ServerResponse.createBySuccess("修改用户状态成功");
        }
        return ServerResponse.createByErrorMessage("修改用户状态失败");
    }

}
