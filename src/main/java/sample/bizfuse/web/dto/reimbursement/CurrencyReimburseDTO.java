package sample.bizfuse.web.dto.reimbursement;
import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import sample.bizfuse.web.model.reimbursement.ReimburseDetail;

import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * Created by PH on 2019/3/25.
 * 通用报销
 */
@Getter
@Setter
public class CurrencyReimburseDTO extends AbstractDTO {

    /**
     * 部门
     */
    @ApiModelProperty("部门")
    private Long depId;

    /**
     * 姓名
     */
    @ApiModelProperty("姓名")
    @NotBlank
    @Size(min = 1, max = 100)

    private String name;

    /**
     * 日期
     */
    @ApiModelProperty("日期")

    private Date reimburseTime;


    private List<ReimburseDetail> details;

    /**
     * 报销金额总和
     */
    @ApiModelProperty("报销金额总和")
    private BigDecimal sumReimburse;

    /**
     * 备注
     */
    @ApiModelProperty("备注")
    private String  mark;

    /**
     * 发票数量
     */
    @ApiModelProperty("发票数量")
    private Integer invoiceCount;

    /**
     * 单位负责人
     */
    @ApiModelProperty("单位负责人")
    private String headOfUnit;

    /**
     * 经办人
     */
    @ApiModelProperty("经办人")
    private String personInCharge;

    /**
     * 办公室负责人
     */
    @ApiModelProperty("办公室负责人")
    private String headOfResearchLaboratory;

}
