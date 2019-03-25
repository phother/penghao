package sample.bizfuse.web.dto;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 学校 Model
 * 
 */
@Getter
@Setter
@ApiModel("学校")
public class SchoolDTO extends AbstractDTO {

	private static final long serialVersionUID = -3331582480188927820L;

	/**
	 * 名称
	 */
	@ApiModelProperty("名称")
	@NotBlank
	@Size(min = 1, max = 100)
	private String name;

	/**
	 * 地址
	 */
	@ApiModelProperty("地址")
	@Size(min = 1, max = 200)
	private String address;
}
