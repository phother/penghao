package sample.bizfuse.web.controller.security;

import java.util.Collection;

import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.leadingsoft.bizfuse.common.web.dto.result.ResultDTO;
import com.leadingsoft.bizfuse.common.webauth.annotation.CurrentUser;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * Security安全相关的测试接口
 *
 * @author liuyg
 */
@Slf4j
@RestController
@RequestMapping("/w")
@Api(tags = { "Security安全相关测试API" })
public class SecurityController {

	/**
	 * 测试接口：测试获取当前登录人
	 *
	 * @return
	 */
	@Timed
	@ApiOperation(value = "获取当前登录人测试", notes = "未登录，报401异常")
	@RequestMapping(value = "/loginUser", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResultDTO<String> loginUser(@CurrentUser String loginUser) {
		log.info("获取当前登录人测试.");
		return ResultDTO.success(String.format("当前登录人：%s", loginUser));
	}

	/**
	 * 测试接口：登录人角色验证
	 *
	 * @return
	 */
	@Timed
	@ApiOperation(value = "ROLE_ADMIN 角色验证", notes = "非ROLE_ADMIN，报403无权访问异常")
	@Secured({ "admin" })
	@RequestMapping(value = "/checkAdmin", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResultDTO<String> adminCheck() {
		log.info("登录人角色验证.");
		String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next()
				.getAuthority();
		return ResultDTO.success(String.format("当前登录人角色：%s", role));
	}

	/**
	 * 测试接口：登录人角色验证
	 *
	 * @return
	 */
	@Timed
	@ApiOperation(value = "ROLE_USER 角色验证", notes = "非ROLE_USER，报403无权访问异常")
	@Secured({ "user" })
	@RequestMapping(value = "/checkUser", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResultDTO<String> userCheck() {
		log.info("登录人角色验证.");
		Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		StringBuilder roles = new StringBuilder();
		authorities.stream().forEach(authority -> roles.append(authority.getAuthority() + ", "));
		return ResultDTO.success(String.format("当前登录人角色：%s", roles.toString()));
	}

	/**
	 * 检查是否已登录
	 *
	 * @return
	 */
	@Timed
	@ApiOperation(value = "验证用户是否登录", notes = "")
	@RequestMapping(value = "/checkLogin", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResultDTO<Boolean> checkUserLogin() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if ((authentication == null) || (authentication instanceof AnonymousAuthenticationToken)) {
			return ResultDTO.failure(Boolean.FALSE);
		} else {
			return ResultDTO.success(Boolean.TRUE);
		}
	}
}
