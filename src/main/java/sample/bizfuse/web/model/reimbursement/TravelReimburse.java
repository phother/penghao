package sample.bizfuse.web.model.reimbursement;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * Created by PH on 2019/3/25.
 * 差旅费用报销
 */
@Entity
@Getter
@Setter
public class TravelReimburse extends AbstractAuditModel {

    /**
     * 部门
     */
    private Long depId;

    /**
     * 姓名
     */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String name;

    /**
     * 日期
     */
    @Temporal(TemporalType.DATE)
    private Date ReimburseTime;

    /**
     * 出差原因
     */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String reason;

    /**
     * 项目名称
     */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String projectName;

    /**
     * 住宿费
     */
    private BigDecimal hotelExpense;

    /**
     * 交通补助天数
     */
    private Integer trafficSubsidyDays;

    /**
     * 交通补助人数
     */
    private Integer trafficSubsidyNum;

    /**
     * 伙食补助天数
     */
    private Integer foodAllowanceDays;

    /**
     * 伙食补助人数
     */
    private Integer foodAllowanceNum;

    /**
     * 其他费用
     */
    private BigDecimal otherFee;

    /**
     * 交通报销
     */
    @ElementCollection
    private List<TrafficReimburse> trafficReimburse;

    /**
     * 单位负责人
     */
    private String headOfUnit;

    /**
     * 经办人
     */
    private String personInCharge;

    /**
     * 办公室负责人
     */
    private String headOfResearchLaboratory;

}
