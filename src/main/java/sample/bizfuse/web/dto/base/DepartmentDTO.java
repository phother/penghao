package sample.bizfuse.web.dto.base;
import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.EnableLoadTimeWeaving;

/**
 * Created by PH on 2019/3/25.
 */
    @ApiModelProperty("Created by PH on 2019/3/25.")
@Getter
@Setter
public class DepartmentDTO extends AbstractDTO {

    /**
     * 部门名称
     */
    @ApiModelProperty("部门名称")
    private String name;
}
