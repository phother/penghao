package sample.bizfuse.web.fixtures;

import java.text.ParseException;
import java.util.List;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.supercsv.cellprocessor.ParseBool;
import org.supercsv.cellprocessor.ParseLong;
import org.supercsv.cellprocessor.constraint.Unique;
import org.supercsv.cellprocessor.ift.CellProcessor;

import sample.bizfuse.web.enums.Gender;
import sample.bizfuse.web.fixtures.base.BaseFixtures;
import sample.bizfuse.web.fixtures.base.CsvListProcessor;
import sample.bizfuse.web.model.authentication.User;
import sample.bizfuse.web.repository.authentication.UserRepository;

/**
 * 用户数据初始化类
 * 
 * @author liuyg
 *
 */
@Component
public class UserFixtures extends BaseFixtures {

	@Autowired
    private PasswordEncoder passwordEncoder;
	@Autowired
	private UserRepository userRepository;

	public UserFixtures() {
		super("用户");
	}

	@Override
	public boolean hasProdDataImported() {
		return !this.userRepository.findAll(new PageRequest(0, 1)).hasContent();
	}

	@Override
	public boolean hasTestDataImported() {
		return false;
	}

	@Override
	public String getDropTableScripts() {
		final StringBuilder sb = new StringBuilder();
		sb.append("SET foreign_key_checks = 0; ").append("<br/>");
		sb.append("drop table if exists user; ").append("<br/>");
		return sb.toString();
	}

	@Override
	protected void prepareData() {

	}

	@Override
	protected void prepareTestData() {
		super.loadCSVDataObjectList("用户信息", "User", new CsvListProcessor() {

			@Override
			public CellProcessor[] getProcessors() {
				return new CellProcessor[] { new Unique(new ParseLong()), null, null, null, null, new ParseLong(), new ParseBool(), new ParseBool(),
						new ParseBool(), null, new ParseBool(), null, null, null, null, null, null, null, null, null, null, null, null, null,
						null };
			}

			@Override
			public void process(List<Object> data) {
				User user = new User();
				int i = 1;
				// ID,CREATED_BY,CREATED_DATE,LAST_MODIFIED_BY,LAST_MODIFIED_DATE,VERSION,
				// ACCOUNT_EXPIRED,ACCOUNT_LOCKED,CREDENTIALS_EXPIRED,EMAIL,ENABLED,LOGIN_ID,MOBILE,NO,PASSWORD,
				//DETAILS_ID,ADDRESS,BIRTHDAY,CITY,COUNTRY,DISTRICT,GENDER,NAME,NICKNAME,PROVINCE
				user.setCreatedBy((String) data.get(i++));
				try {
					user.setCreatedDate(DateUtils.parseDate((String) data.get(i++), "yyyy-MM-dd"));
				} catch (ParseException e) {
					e.printStackTrace();
				}
				user.setLastModifiedBy((String) data.get(i++));
				String lastModifiedDate = (String) data.get(i++);
				if (StringUtils.hasText(lastModifiedDate)) {
					try {
						user.setLastModifiedDate(DateUtils.parseDate(lastModifiedDate, "yyyy-MM-dd"));
					} catch (ParseException e) {
						e.printStackTrace();
					}
				}
				user.setVersion((Long) data.get(i++));
				user.setAccountExpired((boolean)data.get(i++));
				user.setAccountLocked((boolean)data.get(i++));
				user.setCredentialsExpired((boolean)data.get(i++));
				String email = (String) data.get(i++);
				if (StringUtils.hasText(email)) {
					user.setEmail(email);
				}
				user.setEnabled((boolean)data.get(i++));
				String loginId = (String) data.get(i++);
				if (StringUtils.hasText(loginId)) {
					user.setLoginId(loginId);
				}
				String mobile = (String) data.get(i++);
				if (StringUtils.hasText(mobile)) {
					user.setMobile(mobile);
				}
				user.setNo((String) data.get(i++));
				String password = (String) data.get(i++);
				user.setPassword(passwordEncoder.encode(password));
				// detailId
				i++;
				user.getDetails().setAddress((String) data.get(i++));
				try {
					user.getDetails().setBirthday(DateUtils.parseDate((String) data.get(i++), "yyyy-MM-dd"));
				} catch (ParseException e) {
				}
				user.getDetails().setCity((String) data.get(i++));
				user.getDetails().setCountry((String) data.get(i++));
				user.getDetails().setDistrict((String) data.get(i++));
				user.getDetails().setGender(Gender.valueOf((String) data.get(i++)));
				user.getDetails().setName((String) data.get(i++));
				user.getDetails().setNickname((String) data.get(i++));
				user.getDetails().setProvince((String) data.get(i++));
				userRepository.save(user);
			}
		});
	}
}
