package sample.bizfuse.web.service.authentication.impl;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.base.authority.model.role.Role;
import com.leadingsoft.bizfuse.base.authority.service.authorization.SystemAuthorizationService;
import com.leadingsoft.bizfuse.common.webauth.access.SimpleGrantedAuthority;

import lombok.Getter;
import lombok.Setter;
import sample.bizfuse.web.service.authentication.UserService;

/**
 * Created by liuyg on 17-2-23.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserService userService;
    @Autowired
    private SystemAuthorizationService systemAuthorizationService;

	@Override
	@Transactional(readOnly=true)
	public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
		sample.bizfuse.web.model.authentication.User localUser = userService.findUserByIdentity(username);
		if (localUser == null) {
			return null;
		}
		List<Role> roles = systemAuthorizationService.getUserRoles(localUser.getNo());
		List<GrantedAuthority> userRoles = roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
		final UserBean details = new UserBean(localUser.getNo(), localUser.getDetails().getName(), localUser.getPassword(), userRoles);
		
		return details;
	}
	
	@Setter
	@Getter
	public static class UserBean implements UserDetails {
		private static final long serialVersionUID = -9116309104833714960L;
		private String userNo;
		private String password;
		private  String username;
		private  Collection<GrantedAuthority> authorities;
		private  boolean accountNonExpired = true;
		private  boolean accountNonLocked = true;
		private  boolean credentialsNonExpired = true;
		private  boolean enabled = true;
		
		public UserBean(String userNo, String username, String password,
				Collection<GrantedAuthority> authorities) {
			this.userNo = userNo;
			this.username = username;
			this.password = password;
			this.authorities = authorities;
		}
	}
	
}
