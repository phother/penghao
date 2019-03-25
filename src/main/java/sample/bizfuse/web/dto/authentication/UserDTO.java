package sample.bizfuse.web.dto.authentication;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.leadingsoft.bizfuse.common.web.dto.AbstractAuditDTO;

import lombok.Getter;
import lombok.Setter;
import sample.bizfuse.web.enums.Gender;

@Getter
@Setter
public class UserDTO extends AbstractAuditDTO {

	private static final long serialVersionUID = -5593073568563915155L;

	/**
	 * 用户编号，所有系统通用的用户惟一标识
	 */
	private String no;

	/**
	 * 登录名称
	 */
	private String loginId;

	/**
	 * 手机号码
	 */
	private String mobile;

	/**
	 * 电子邮箱
	 */
	private String email;

	/**
	 * 原始密码（仅仅后台管理员创建用户时使用）
	 */
	private String password;

	//////////////////////////////////////////////////
	/// 用户的基本信息
	//////////////////////////////////////////////////
	/**
	 * 姓名
	 */
	private String name;

	/**
	 * 昵称
	 */
	private String nickname;

	/**
	 * 生日
	 */
	private Date birthday;

	/**
	 * 性别
	 */
	private Gender gender;

	/**
	 * 地区（国家）
	 */
	private String country;

	/**
	 * 地区（省）
	 */
	private String province;

	/**
	 * 地区（市）
	 */
	private String city;

	/**
	 * 地区（区县）
	 */
	private String district;

	/**
	 * 地址
	 */
	private String address;

	/////////////////////////////////////////////////////////
	/// 用户帐号状态
	/////////////////////////////////////////////////////////
	/**
	 * 帐号是否启用
	 */
	private boolean enabled = true;

	/**
	 * 帐号是否锁定
	 */
	private boolean accountLocked;

	/**
	 * 帐号是否过期
	 */
	private boolean accountExpired;

	/**
	 * 密码是否过期
	 */
	private boolean credentialsExpired;

	/////////////////////////////////////////////////////////
	/// 用户权限信息
    /////////////////////////////////////////////////////////
	private List<Long> roleIdsList = new ArrayList<>();
	
	private List<String> roleNamesList = new ArrayList<>();
}