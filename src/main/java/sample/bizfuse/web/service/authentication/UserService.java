package sample.bizfuse.web.service.authentication;

import sample.bizfuse.web.model.authentication.User;

public interface UserService {

	////////////////////////////////////////////////////////////////////////////
	//// 查询类接口
	////////////////////////////////////////////////////////////////////////////
    /**
     * 通过身份标识查找用户
     *
     * @param identity 身份标识，可能是 LoginId/Mobile/Email
     * @return 成功时返回找到的用户对象; 失败时返回 null
     */
    User findUserByIdentity(final String identity);

    ///////////////////////////////////////////////////////////////////////////////
    //// 注册类接口
    ///////////////////////////////////////////////////////////////////////////////
    /**
     * 创建用户帐号
     *
     * @param user 新用户的参数信息
     * @return 创建后的用户对象
     */
    User createUser(final User user);
    
    /**
     * 通过用户名密码注册新账户
     *
     * @param loginId 登录ID
     * @param password 登录密码
     * @param name 真实姓名
     * @param nickname 用户别名
     * @return 注册成功后的用户对象
     */
    User registerUserByUsernamePassword(String loginId, String password, String name, String nickname);

    /**
     * 通过邮件注册新账户
     *
     * @param email 邮件地址
     * @param password 登录密码
     * @param name 真实姓名
     * @param nickname 用户别名
     * @return 注册成功后的用户对象
     */
    User registerUserByEmail(String email, String password, String name, String nickname);

    /**
     * 通过手机号注册新账户
     *
     * @param mobile 手机号
     * @param password 登录密码
     * @param name 真实姓名
     * @param nickname 用户别名
     * @return 注册成功后的用户对象
     */
    User registerUserByMobile(String mobile, String password, String name, String nickname);

    
    ///////////////////////////////////////////////////////////////////////////////
    //// 更新类接口
    ///////////////////////////////////////////////////////////////////////////////
    /**
     * 用户绑定手机号
     *
     * @param id 用户ID
     * @param mobile 手机号
     * @return
     */
    User bindUserMobile(long id, String mobile);

    /**
     * 用户绑定邮箱
     *
     * @param id 用户ID
     * @param email 邮箱
     * @return
     */
    User bindUserEmail(long id, String email);

    /**
     * 修改手机用户的登录密码
     *
     * @param id 用户ID
     * @param password 登录密码，不允许为空
     */
    void changeUserPassword(long id, String password);
    
    /**
     * 设置用户的登录ID
     *
     * @param id 用户ID
     * @param loginId 登录ID
     * @return 修改后的用户对象
     */
    void setUserLoginId(long id, String loginId);
}
