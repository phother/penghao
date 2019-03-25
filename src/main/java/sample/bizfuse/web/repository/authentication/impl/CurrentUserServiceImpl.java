package sample.bizfuse.web.repository.authentication.impl;

import com.leadingsoft.bizfuse.common.webauth.access.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import sample.bizfuse.web.repository.authentication.UserRepository;

@Component
public class CurrentUserServiceImpl implements CurrentUserService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public Object loadUserByUsername(String arg0) {
		return this.userRepository.findOneByNo(arg0);
	}

}
