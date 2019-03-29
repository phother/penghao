package sample.bizfuse.web.dto.base;
import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.context.annotation.EnableLoadTimeWeaving;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
public class DepartmentDTO extends AbstractDTO {
        private String name;
        private String description;
}
