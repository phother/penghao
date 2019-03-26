package sample.bizfuse.web.model.reimbursement;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
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
@Entity
public class CurrencyReimburse extends AbstractAuditModel {

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
    private Date reimburseTime;


    @NotNull
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "CurrencyReimburse_id")
    private List<ReimburseDetail> details;

    /**
     * 报销金额总和
     */
    private BigDecimal sumReimburse;

    /**
     * 备注
     */
    private String  mark;

    /**
     * 发票数量
     */
    private Integer invoiceCount;

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
