package sample.bizfuse.web.controller.authentication;

import javax.validation.Valid;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.leadingsoft.bizfuse.base.authority.service.authorization.SystemAuthorizationService;
import com.leadingsoft.bizfuse.common.web.dto.result.PageResultDTO;
import com.leadingsoft.bizfuse.common.web.dto.result.ResultDTO;
import com.leadingsoft.bizfuse.common.web.support.Searchable;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import sample.bizfuse.web.convertor.authentication.UserConvertor;
import sample.bizfuse.web.dto.authentication.UserDTO;
import sample.bizfuse.web.model.authentication.User;
import sample.bizfuse.web.repository.authentication.UserRepository;
import sample.bizfuse.web.service.authentication.UserService;

/**
 * Web端的用户管理功能接口
 */
@Slf4j
@RestController
@RequestMapping("/w/platformUser")
@Api(tags = {"User管理API" })
public class UserController {

	@Autowired
	private UserService userService;
	@Autowired
	private UserConvertor userConvertor;
	@Autowired
	private UserRepository userRepository;
    @Autowired
    private SystemAuthorizationService systemAuthorizationService;
	
	/**
	 * 用户的分页数据
	 */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
	@RequestMapping(value="/s", method = RequestMethod.POST)
	public PageResultDTO<UserDTO> page(final Pageable pageable, Searchable searchable) {
		final Page<User> pageModel = this.userRepository.searchAll(searchable, pageable);

		return this.userConvertor.toResultDTO(pageModel);
	}

	/**
	 * 创建用户
	 */
    @Timed
    @ApiOperation(value = "创建用户", notes = "")
	@RequestMapping(method = RequestMethod.POST)
	public ResultDTO<UserDTO> create(@RequestBody final UserDTO dto) {
		final User paramModel = this.userConvertor.toModel(dto);
		final User savedModel = this.userService.createUser(paramModel);
		systemAuthorizationService.updateUserRoles(savedModel.getNo(), dto.getRoleIdsList()); // 分配角色
		log.info(String.format("新建用户 [ %s ]", savedModel.getNo()));
		final ResultDTO<UserDTO> resultDTO = this.userConvertor.toResultDTO(savedModel);
		return resultDTO;
	}
	
	/**
	 * 获取用户详细
	 */
    @Timed
    @ApiOperation(value = "获取用户详细", notes = "")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResultDTO<UserDTO> get(@PathVariable("id") final Long id) {
		final User model = this.userRepository.findOne(id);

		final ResultDTO<UserDTO> resultDTO = this.userConvertor.toResultDTO(model);
		return resultDTO;
	}
	
	/**
	 * 修改用户信息
	 * <p>
	 * 此处不允许修改惟一性字段（登录名称、手机号码、电子邮箱）及登录密码
	 */
    @Timed
    @ApiOperation(value = "修改用户信息", notes = "")
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResultDTO<UserDTO> update(@PathVariable("id") final long id, @RequestBody final UserDTO dto) {
		dto.setId(id);

		final User paramModel = this.userConvertor.toModel(dto);
		final User savedModel = this.userRepository.save(paramModel);
		systemAuthorizationService.updateUserRoles(savedModel.getNo(), dto.getRoleIdsList()); // 分配角色

		final ResultDTO<UserDTO> resultDTO = this.userConvertor.toResultDTO(savedModel);
		return resultDTO;
	}
	
	/**
	 * 设置用户的登录名称
	 * <p>
	 * 仅当 loginId 为空时可设置
	 */
    @Timed
    @ApiOperation(value = "设置用户的登录名", notes = "仅当 loginId 为空时可设置")
	@RequestMapping(value = "/{id}/setLoginId", method = RequestMethod.PUT)
	public ResultDTO<UserDTO> changeLoginId(@PathVariable("id") final long id,
			@RequestBody @Valid final ChangeLoginIdDTO dto) {
		this.userService.setUserLoginId(id, dto.getLoginId());

		return this.userConvertor.toResultDTO(this.userRepository.findOne(id));
	}

	/**
	 * 修改用户的手机号码
	 */
    @Timed
    @ApiOperation(value = "修改用户的手机号码", notes = "")
	@RequestMapping(value = "/{id}/changeMobile", method = RequestMethod.PUT)
	public ResultDTO<UserDTO> changeMobile(@PathVariable("id") final long id,
			@RequestBody @Valid final ChangeMobileDTO dto) {
		final User savedModel = this.userService.bindUserMobile(id, dto.getMobile());

		final ResultDTO<UserDTO> resultDTO = this.userConvertor.toResultDTO(savedModel);
		return resultDTO;
	}

	/**
	 * 修改用户的电子邮箱
	 */
    @Timed
    @ApiOperation(value = "修改用户的电子邮箱", notes = "")
	@RequestMapping(value = "/{id}/changeEmail", method = RequestMethod.PUT)
	public ResultDTO<UserDTO> changeEmail(@PathVariable("id") final long id,
			@RequestBody @Valid final ChangeEmailDTO dto) {
		final User savedModel = this.userService.bindUserEmail(id, dto.getEmail());

		final ResultDTO<UserDTO> resultDTO = this.userConvertor.toResultDTO(savedModel);
		return resultDTO;
	}

	/**
	 * 修改用户的登录密码
	 */
    @Timed
    @ApiOperation(value = "修改用户的登录密码", notes = "")
	@RequestMapping(value = "/{id}/changePassword", method = RequestMethod.PUT)
	public ResultDTO<UserDTO> changePassword(@PathVariable("id") final long id,
			@RequestBody @Valid final ChangePasswordDTO dto) {
		this.userService.changeUserPassword(id, dto.getPassword());

		final ResultDTO<UserDTO> resultDTO = this.userConvertor.toResultDTO(userRepository.findOne(id));
		return resultDTO;
	}
	
	@Getter
	private final static class ChangeLoginIdDTO {
		@NotBlank
		private String loginId;
	}

	@Getter
	private final static class ChangeMobileDTO {
		@NotBlank
		private String mobile;
	}

	@Getter
	private final static class ChangeEmailDTO {
		@NotBlank
		private String email;
	}

	@Getter
	private final static class ChangePasswordDTO {
		@NotBlank
		private String password;
	}
}
