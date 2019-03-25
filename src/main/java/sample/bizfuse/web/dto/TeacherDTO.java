package sample.bizfuse.web.dto;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import sample.bizfuse.web.enums.TeacherLevel;

@Getter
@Setter
@ApiModel("老师")
public class TeacherDTO extends AbstractDTO {

	private static final long serialVersionUID = 3548952750232202016L;

	@NotBlank
    @Size(min = 1, max = 50)
	@ApiModelProperty("姓名")
	private String name;

	@ApiModelProperty("年龄")
	@Min(18)
    @Max(150)
	private int age;

	@Min(0)
    @Max(100)
	@ApiModelProperty("教龄")
	private int teachingAge;

	@ApiModelProperty("等级：PRACTICE, CAREER, SENIOR, SPECIAL, EXPERT")
	private TeacherLevel level;
}
