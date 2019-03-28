package sample.bizfuse.web.model.reimbursement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import sample.bizfuse.web.enums.TrafficLevel;
import sample.bizfuse.web.enums.Vehicle;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
@Entity
public class TrafficReimburse extends AbstractAuditModel {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER,cascade= CascadeType.ALL)
    @JoinColumn(name="TravelReimburse_id")
    private TravelReimburse travelReimburse;

    /**
     * 日期
     */
    @Temporal(TemporalType.DATE)
    private Date trafficTime;

    /**
     * 出发地
     */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String source;
    /**
     * 目的地
     */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String Destination;

    /**
     * 交通工具
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    private Vehicle vehicle;

    /**
     * 座位等级选择
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    private TrafficLevel level;

    /**
     * 费用
     */
    private BigDecimal trafficeFee;

}
