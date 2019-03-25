package sample.bizfuse.web.repository.authentication;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.authentication.User;

/**
 * DAO for the User Entity exposing Rest Endpoint
 */
public interface UserRepository extends Repository<User, Long>, UserRepositoryCustom {

	Page<User> findAll(Pageable pageable);

	User findOne(Long id);

	User findOneByNo(String no);

	User findOneByLoginId(String loginId);

	User findOneByMobile(String mobile);

	User findOneByEmail(String email);

	User save(User user);

	List<User> findAllByMobileIn(List<String> mobiles);

}
