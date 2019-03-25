package sample.bizfuse.web.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;

import lombok.Getter;
import lombok.Setter;

/**
 * 学生 Model
 * <p>
 * <code>@Cache</code> 用来配置二级缓存
 */
@Getter
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Student extends AbstractAuditModel {

    private static final long serialVersionUID = -8272200930143261633L;

    /**
     * （我的）老师列表 - 多对多关系
     */
    @Setter
    @ManyToMany
    @JoinTable(name = "student_teacher",
            joinColumns = {@JoinColumn(name = "student_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "teacher_id", referencedColumnName = "id")})
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private List<Teacher> teachers = new ArrayList<>();
    
    /**
     * （我的）学校 - 多对一关系
     */
    @Setter
    @NotNull
    @ManyToOne
    private School school;
    
    /**
     * （我的）档案 - 一对一的强所属关系，配置级联操作
     */
    @OneToOne(cascade=CascadeType.ALL)
    private StudentProfile profile = new StudentProfile();
    
    /**
     * 姓名
     */
    @Setter
    @NotBlank
    @Size(min = 1, max = 50)
    @Column(length = 50, nullable = false)
    private String name;

    /**
     * 年级
     */
    @Setter
    @Min(1)
    @Column(nullable = false)
    private int grade;

    /**
     * 是否毕业
     */
    @Setter
    private boolean graduate = false;
}
