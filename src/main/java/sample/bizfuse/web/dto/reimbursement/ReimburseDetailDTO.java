package sample.bizfuse.web.dto.reimbursement;
import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import sample.bizfuse.web.enums.Subject;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
public class ReimburseDetailDTO extends AbstractDTO {

    /**
     * 摘要
     */
    @ApiModelProperty("摘要")
    @NotBlank
    @Size(min = 1, max = 100)

    private String remark;

    /**
     *科目
     */
    @Enumerated(EnumType.STRING)
    @ApiModelProperty("科目")
    private Subject subId;

    /**
     * 报销金额
     */
    @ApiModelProperty("报销金额")
    private BigDecimal remiburseMoney;

}
