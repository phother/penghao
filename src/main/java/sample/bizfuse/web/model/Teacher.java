package sample.bizfuse.web.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;

import lombok.Getter;
import lombok.Setter;
import sample.bizfuse.web.enums.TeacherLevel;

@Getter
@Setter
@Entity
public class Teacher extends AbstractAuditModel {

    private static final long serialVersionUID = -963992146469620117L;

    /**
     * 姓名
     */
    @NotBlank
    @Size(min = 1, max = 50)
    @Column(length = 50, nullable = false)
    private String name;

    /**
     * 年龄
     */
    @Min(18)
    @Max(150)
    private int age;
    
	/**
	 * 教龄
	 */
    @Min(0)
    @Max(100)
	private int teachingAge;
	
    /**
     * 教师等级（枚举值按字符串存储）
     */
    @Enumerated(EnumType.STRING)
	private TeacherLevel level;
}
