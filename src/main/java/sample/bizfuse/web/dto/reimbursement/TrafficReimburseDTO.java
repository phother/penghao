package sample.bizfuse.web.dto.reimbursement;
import com.leadingsoft.bizfuse.common.web.dto.AbstractDTO;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import sample.bizfuse.web.enums.TrafficLevel;
import sample.bizfuse.web.enums.Vehicle;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
public class TrafficReimburseDTO extends AbstractDTO {

    /**
     * 日期
     */
    @ApiModelProperty("日期")

    private Date trafficTime;

    /**
     * 出发地
     */
    @ApiModelProperty("出发地")
    private String source;
    /**
     * 目的地
     */
    @ApiModelProperty("目的地")
    private String Destination;

    /**
     * 交通工具
     */
    @Enumerated(EnumType.STRING)
    @ApiModelProperty("交通工具")
    private Vehicle vehicle;

    /**
     * 座位等级选择
     */
    @ApiModelProperty("座位等级选择")
    @Enumerated(EnumType.STRING)
    private TrafficLevel level;

    /**
     * 费用
     */
    @ApiModelProperty("费用")
    private BigDecimal trafficeFee;

}
