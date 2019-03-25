package sample.bizfuse.web.dto;

import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 学生档案信息
 */
@Getter
@Setter
@ApiModel("学生档案")
public class StudentProfileDTO extends AbstractDTO {

	private static final long serialVersionUID = 2405627857342379022L;

	/**
	 * 学生ID
	 */
	private Long studentId;
	
	/**
	 * 小学
	 */
	@ApiModelProperty("小学")
	private String primarySchool;

	/**
	 * 初中
	 */
	@ApiModelProperty("初中")
	private String middleSchool;

	/**
	 * 高中
	 */
	@ApiModelProperty("高中")
	private String highSchool;

	/**
	 * 大学
	 */
	@ApiModelProperty("大学")
	private String university;
}
