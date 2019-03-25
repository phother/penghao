package sample.bizfuse.web.repository.authentication;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.leadingsoft.bizfuse.common.web.support.Searchable;

import sample.bizfuse.web.model.authentication.User;

public interface UserRepositoryCustom {

	Page<User> searchAll(Searchable searchable, Pageable pageable);
	
	List<User> searchAll(Searchable searchable);
}
