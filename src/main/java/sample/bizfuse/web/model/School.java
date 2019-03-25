package sample.bizfuse.web.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;

import lombok.Getter;
import lombok.Setter;

/**
 * 学校 Model
 * 
 */
@Getter
@Setter
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class School extends AbstractAuditModel {

	private static final long serialVersionUID = -8924719098568775845L;

	/**
	 * 名称
	 */
    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
	private String name;

    /**
	 * 地址
	 */
    @Size(min = 1, max = 200)
    @Column(length = 200, nullable = true)
    private String address;
}
