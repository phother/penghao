package sample.bizfuse.web.model.reimbursement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
@Entity
public class ReimburseDetail extends AbstractAuditModel {

    /**
     * 摘要
     */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100)
    private String remark;

    /**
     *科目
     */
    private Long subId;

    /**
     * 报销金额
     */
    private BigDecimal remiburseMoney;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER,cascade= CascadeType.ALL)
    @JoinColumn(name="CINEMA_ID")
    private CurrencyReimburse currencyReimburse;

}
