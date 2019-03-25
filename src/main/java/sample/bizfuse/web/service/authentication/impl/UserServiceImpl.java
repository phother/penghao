package sample.bizfuse.web.service.authentication.impl;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;

import lombok.NonNull;
import sample.bizfuse.web.model.authentication.User;
import sample.bizfuse.web.repository.authentication.UserRepository;
import sample.bizfuse.web.service.IdGeneratorService;
import sample.bizfuse.web.service.authentication.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private IdGeneratorService idGeneratorService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public User findUserByIdentity(@NonNull String identity) {
		// 如果 identity 匹配用户的手机号码
		if (isMobile(identity)) {
			return this.userRepository.findOneByMobile(identity);
		}
		// 如果 identity 匹配用户的电子邮箱
		if (isEmail(identity)) {
			return this.userRepository.findOneByEmail(identity);
		}
		// 通过 identity 匹配用户的登录名称
		return this.userRepository.findOneByLoginId(identity);
	}

	@Override
	public User createUser(User user) {

		// 校验 loginId 的惟一性
		final String loginId = user.getLoginId();
		if (StringUtils.hasText(loginId)) {
			if (this.userRepository.findOneByLoginId(loginId) != null) {
				throw new CustomRuntimeException("loginId.exists", String.format("用户登录名[%s]已存在", loginId));
			}
		}

		// 校验 mobile 的惟一性
		final String mobile = user.getMobile();
		if (StringUtils.hasText(mobile)) {
			if (this.userRepository.findOneByMobile(mobile) != null) {
				throw new CustomRuntimeException("mobile.exists", String.format("用户手机号码[%s]已存在", mobile));
			}
		}

		// 校验 email 的惟一性
		final String email = user.getEmail();
		if (StringUtils.hasText(email)) {
			if (this.userRepository.findOneByEmail(email) != null) {
				throw new CustomRuntimeException("email.exists", String.format("用户电子邮箱[%s]已存在", email));
			}
		}

		// 校验登录标识 loginId/mobile/email 的有效性
		if (!StringUtils.hasText(loginId) && !StringUtils.hasText(mobile) && !StringUtils.hasText(email)) {
			throw new CustomRuntimeException("identity.notEmpty", "必须指定用户登录名称[loginId], 或手机号码[mobile], 或电子邮箱[email]");
		}

		// 校验 password 的有效性
		final String password = user.getPassword();
		if (!StringUtils.hasText(password)) {
			throw new CustomRuntimeException("password.notEmpty", "必须指定用户登录密码[password]");
		}

		// 生成用户唯一编码
		user.setNo(this.idGeneratorService.generateUserNo());

		return this.userRepository.save(user);
	}

	@Override
	public User registerUserByUsernamePassword(String loginId, String password, String name, String nickname) {
		if (!StringUtils.hasText(loginId)) {
			throw new CustomRuntimeException("loginId.notEmpty", "必须指定用户名[loginId]");
		}
		final User existing = this.userRepository.findOneByLoginId(loginId);
		if (existing != null) {
			throw new CustomRuntimeException("loginId.exists", String.format("用户名[%s]已存在", loginId));
		}
		final User user = new User();
		user.setNo(this.idGeneratorService.generateUserNo());
		user.setLoginId(loginId);
		user.setPassword(this.passwordEncoder.encode(password));
		user.getDetails().setName(name);
		user.getDetails().setNickname(nickname);
		user.setEnabled(true);
		this.userRepository.save(user);
		return user;
	}

	@Override
	public User registerUserByEmail(String email, String password, String name, String nickname) {
		if (!StringUtils.hasText(email)) {
			throw new CustomRuntimeException("email.notEmpty", "必须指定邮件地址[email]");
		}
		final User existingUser = this.userRepository.findOneByEmail(email);
		if (existingUser != null) {
			throw new CustomRuntimeException("email.exists", String.format("邮件地址[%s]已经被注册.", email));
		}
		final User user = new User();
		user.setNo(this.idGeneratorService.generateUserNo());
		user.setEmail(email);
		user.setPassword(this.passwordEncoder.encode(password));
		user.setEnabled(false);
		user.getDetails().setName(name);
		user.getDetails().setNickname(nickname);
		this.userRepository.save(user);
		// TODO:生成邮箱激活码，并发送给注册的邮件地址
		// 等待用户激活邮箱，并设置账户enabled为true
		return user;
	}

	@Override
	public User registerUserByMobile(String mobile, String password, String name, String nickname) {
		if (!StringUtils.hasText(mobile)) {
			throw new CustomRuntimeException("mobile.notEmpty", "必须指定用户手机号码[mobile]");
		}
		final User existing = this.userRepository.findOneByMobile(mobile);
		if (existing != null) {
			throw new CustomRuntimeException("mobile.exists", String.format("用户手机号码[%s]已被其它帐号绑定", mobile));
		}
		final User user = new User();
		user.setNo(this.idGeneratorService.generateUserNo());
		user.setMobile(mobile);
		user.setPassword(this.passwordEncoder.encode(password));
		user.getDetails().setName(name);
		user.getDetails().setNickname(nickname);
		user.setEnabled(true);
		this.userRepository.save(user);
		return user;
	}

	@Override
	public User bindUserMobile(long id, String mobile) {
		if (!this.isMobile(mobile)) {
			throw new CustomRuntimeException("mobile.format.error", String.format("手机号码[%s]格式错误.", mobile));
		}
		User user = userRepository.findOne(id);
		if ((user.getMobile() != null) && user.getMobile().equals(mobile)) {
			return user;
		}

		final User mobileRegistedUser = this.userRepository.findOneByMobile(mobile);
		if (mobileRegistedUser != null) {
			throw new CustomRuntimeException("mobile.exists", String.format("手机号码[%s]已被其它帐号绑定", mobile));
		}
		user.setMobile(mobile);
		this.userRepository.save(user);
		return user;
	}

	@Override
	public User bindUserEmail(long id, String email) {
		if (!this.isEmail(email)) {
			throw new CustomRuntimeException("email.format.error", String.format("邮箱地址[%s]格式错误.", email));
		}
		User user = userRepository.findOne(id);
		if ((user.getEmail() != null) && user.getEmail().equals(email)) {
			return user;
		}
		final User existingUser = this.userRepository.findOneByEmail(email);
		if (existingUser != null) {
			throw new CustomRuntimeException("email.exists", String.format("邮箱[%s]已被其它帐号绑定.", email));
		}
		user.setEmail(email);
		return this.userRepository.save(user);
	}

	@Override
	public void changeUserPassword(long id, String password) {
		final User user = this.userRepository.findOne(id);
		user.setPassword(this.passwordEncoder.encode(password));
		this.userRepository.save(user);
	}

	@Override
	public void setUserLoginId(long id, String loginId) {
		final User user = this.userRepository.findOne(id);

		// 登录名称只允许设置一次
		if (StringUtils.hasText(user.getLoginId())) {
			throw new CustomRuntimeException("loginId.cannot.reset", "登录名称已设置, 不允许重新设置");
		}

		final User anotherUser = this.userRepository.findOneByLoginId(loginId);
		if ((anotherUser != null) && (anotherUser.getId() != user.getId())) {
			throw new CustomRuntimeException("loginId.exists", String.format("登录名[%s]已占用", loginId));
		}

		user.setLoginId(loginId);

		this.userRepository.save(user);
	}

	private boolean isMobile(String value) {
		// 手机号正则表达式
		Pattern regex = Pattern.compile("^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$");
		Matcher m = regex.matcher(value);
		return m.matches();
	}

	private boolean isEmail(String value) {
		Pattern regex = Pattern.compile("^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w{2,3}){1,3})$");
		Matcher m = regex.matcher(value);
		return m.matches();
	}
}
