package com.epost.dao;

import com.epost.pojo.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    //检查用户是否存在
    int checkUsername(String username);
    //检查邮箱是否被注册
    int checkEmail(String email);
    //登录方法
    User selectLogin(@Param("username") String username, @Param("password")String password);
    //获取用户的提示问题
    String selectQuestionByUsername(String username);
    //校验用户提交上来的答案是否正确
    int checkAnswer(@Param("username")String username,@Param("question")String question,@Param("answer")String answer);
    //更新用户密码
    int updatePasswordByUsername(@Param("username")String username,@Param("passwordNew")String passwordNew);
    //检查密码是否正确
    int checkPassword(@Param(value="password")String password,@Param("userId")Integer userId);
    //判断邮箱是否已经注册
    int checkEmailByUserId(@Param(value="email")String email,@Param(value="userId")Integer userId);
    //获取用户列表
    List<User> selectUserList();
    //获取当前用户数
    Integer getUserCount();
}