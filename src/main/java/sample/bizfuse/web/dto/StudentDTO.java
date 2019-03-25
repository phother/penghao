package sample.bizfuse.web.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 学生 Model
 * <p>
 * <code>@Cache</code> 用来配置二级缓存
 */
@Getter
@Setter
@ApiModel("学生")
public class StudentDTO extends AbstractDTO {

	private static final long serialVersionUID = -1086039855150609859L;

	/**
	 * （我的）学校 - 多对一关系
	 */
	@ApiModelProperty("学校ID")
	@NotNull
	private Long schoolId;

	/**
	 * 学校名称
	 */
	@ApiModelProperty("学校ID")
	private String schoolName;

	/**
	 * 姓名
	 */
	@ApiModelProperty("姓名")
	@NotBlank
	@Size(min = 1, max = 50)
	private String name;

	/**
	 * 年级
	 */
	@ApiModelProperty("年级")
	@Min(1)
	private int grade;

	/**
	 * 档案
	 */
	@ApiModelProperty("档案")
	private StudentProfileDTO profile;
	
	/**
	 * 是否毕业
	 */
	private boolean graduate;
}
