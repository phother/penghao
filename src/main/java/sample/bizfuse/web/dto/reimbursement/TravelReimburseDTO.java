package sample.bizfuse.web.dto.reimbursement;
import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import sample.bizfuse.web.model.reimbursement.TrafficReimburse;

import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * Created by PH on 2019/3/25.
 * 差旅费用报销
 */
@Getter
@Setter
public class TravelReimburseDTO extends AbstractDTO {

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

    private Date ReimburseTime;

    /**
     * 出差原因
     */
    @ApiModelProperty("出差原因")
    @NotBlank
    @Size(min = 1, max = 100)

    private String reason;

    /**
     * 项目名称
     */
    @ApiModelProperty("项目名称")
    @NotBlank
    @Size(min = 1, max = 100)

    private String projectName;

    /**
     * 住宿费
     */
    @ApiModelProperty("住宿费")
    private BigDecimal hotelExpense;

    /**
     * 交通补助天数
     */
    @ApiModelProperty("交通补助天数")
    private Integer trafficSubsidyDays;

    /**
     * 交通补助人数
     */
    @ApiModelProperty("交通补助人数")
    private Integer trafficSubsidyNum;

    /**
     * 伙食补助天数
     */
    @ApiModelProperty("伙食补助天数")
    private Integer foodAllowanceDays;

    /**
     * 伙食补助人数
     */
    @ApiModelProperty("伙食补助人数")
    private Integer foodAllowanceNum;

    /**
     * 其他费用
     */
    @ApiModelProperty("其他费用")
    private BigDecimal otherFee;

    /**
     * 交通报销
     */
    @ApiModelProperty("交通报销")
    private List<TrafficReimburseDTO> trafficReimburse;

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
