package sample.bizfuse.web.convertor.authentication;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.base.authority.model.role.Role;
import com.leadingsoft.bizfuse.base.authority.service.authorization.SystemAuthorizationService;
import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;

import sample.bizfuse.web.dto.authentication.UserDTO;
import sample.bizfuse.web.model.authentication.User;
import sample.bizfuse.web.repository.authentication.UserRepository;

@Component
public class UserConvertor extends AbstractConvertor<User, UserDTO> {

	@Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SystemAuthorizationService systemAuthorizationService;

    @Override
    public User toModel(@NotNull final UserDTO dto) {
        if (dto.isNew()) {// 用户新增操作
            return this.newModel(dto);
        } else {// 用户修改操作
            return this.updateModel(dto);
        }
    }

    private User updateModel(final UserDTO dto) {
        final User model = this.userRepository.findOneByNo(dto.getNo());
        model.getDetails().setName(dto.getName());
        model.getDetails().setNickname(dto.getNickname());
        model.getDetails().setBirthday(dto.getBirthday());
        model.getDetails().setGender(dto.getGender());
        model.getDetails().setCountry(dto.getCountry());
        model.getDetails().setProvince(dto.getProvince());
        model.getDetails().setCity(dto.getCity());
        model.getDetails().setDistrict(dto.getDistrict());
        model.getDetails().setAddress(dto.getAddress());
        model.setEnabled(dto.isEnabled());

        return model;
    }

    private User newModel(final UserDTO dto) {
        final User model = new User();
        model.setLoginId(dto.getLoginId());
        model.setMobile(dto.getMobile());
        model.setEmail(dto.getEmail());
        model.setPassword(this.passwordEncoder.encode(dto.getPassword()));
        model.getDetails().setName(dto.getName());
        model.getDetails().setNickname(dto.getNickname());
        model.getDetails().setBirthday(dto.getBirthday());
        model.getDetails().setGender(dto.getGender());
        model.getDetails().setCountry(dto.getCountry());
        model.getDetails().setProvince(dto.getProvince());
        model.getDetails().setCity(dto.getCity());
        model.getDetails().setDistrict(dto.getDistrict());
        model.getDetails().setAddress(dto.getAddress());
        model.setEnabled(dto.isEnabled());
        return model;
    }

    @Override
    public UserDTO toDTO(@NotNull final User model, final boolean forListView) {
        final UserDTO dto = new UserDTO();

        dto.setId(model.getId());
        dto.setNo(model.getNo());
        dto.setLoginId(model.getLoginId());
        dto.setMobile(model.getMobile());
        dto.setEmail(model.getEmail());
        // dto.setPassword(model.getPassword()); 密码不返给客户端
        dto.setName(model.getDetails().getName());
        dto.setNickname(model.getDetails().getNickname());
        dto.setBirthday(model.getDetails().getBirthday());
        dto.setGender(model.getDetails().getGender());
        dto.setCountry(model.getDetails().getCountry());
        dto.setProvince(model.getDetails().getProvince());
        dto.setCity(model.getDetails().getCity());
        dto.setDistrict(model.getDetails().getDistrict());
        dto.setAddress(model.getDetails().getAddress());
        dto.setEnabled(model.isEnabled());
        dto.setAccountLocked(model.isAccountLocked());
        dto.setAccountExpired(model.isAccountExpired());
        dto.setCredentialsExpired(model.isCredentialsExpired());
        
        List<Role> roles = systemAuthorizationService.getUserRoles(model.getNo());
        roles.stream().forEach(role -> {
        	dto.getRoleIdsList().add(role.getId());
        	dto.getRoleNamesList().add(role.getDescription());
        });
        this.loadAuditToDTO(model, dto);

        return dto;
    }

}
