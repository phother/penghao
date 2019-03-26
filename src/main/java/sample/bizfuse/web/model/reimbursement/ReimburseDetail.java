package sample.bizfuse.web.model.reimbursement;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import sample.bizfuse.web.enums.Subject;

import javax.persistence.Column;
import javax.persistence.Entity;
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
    private Subject subId;

    /**
     * 报销金额
     */
    private BigDecimal remiburseMoney;

}
