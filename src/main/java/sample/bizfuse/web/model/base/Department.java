package sample.bizfuse.web.model.base;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.context.annotation.EnableLoadTimeWeaving;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by PH on 2019/3/25.
 */
@Getter
@Setter
@Entity
public class Department extends AbstractAuditModel {
        @NotBlank
        @Column(
                unique = true
        )
        private String name;
        @Column
        private String description;
}
