package sample.bizfuse.web.model.base;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.EnableLoadTimeWeaving;

import javax.persistence.Entity;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
@Entity
public class Department extends AbstractAuditModel {

    /**
     * 部门名称
     */
    private String name;
}
