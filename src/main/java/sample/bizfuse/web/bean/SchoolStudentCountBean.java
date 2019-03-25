package sample.bizfuse.web.bean;

import lombok.Getter;
import lombok.Setter;

/**
 * 学校学生数量BEAN
 */
@Getter
@Setter
public class SchoolStudentCountBean {

	private long schoolId;
	
	private String schoolName;
	
	private int studentCount; 
}
