package sample.bizfuse.web.model;

import javax.persistence.Column;
import javax.persistence.Entity;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;

import lombok.Getter;
import lombok.Setter;

/**
 * 学生档案信息
 */
@Getter
@Setter
@Entity
public class StudentProfile extends AbstractAuditModel {

	private static final long serialVersionUID = 5689514844594604557L;

	/**
	 * 小学
	 */
	@Column(length=100)
	private String primarySchool;
	
	/**
	 * 初中
	 */
	@Column(length=100)
	private String middleSchool;
	
	/**
	 * 高中
	 */
	@Column(length=100)
	private String highSchool;
	
	/**
	 * 大学
	 */
	@Column(length=100)
	private String university;
}
