package sample.bizfuse.web.model.authentication;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.leadingsoft.bizfuse.common.jpa.model.AbstractAuditModel;

import lombok.Getter;
import lombok.Setter;

/**
 * 基本用户
 */
@Getter
@Setter
@Entity
public class User extends AbstractAuditModel {
    private static final long serialVersionUID = -8340085416786021618L;

    /**
     * 用户编号
     */
    @NotBlank
    @Length(max = 20)
    @Column(unique = true, nullable = false, updatable = false, length = 20)
    private String no;

    /**
     * 登录名称
     */
    @Length(max = 32)
    @Column(unique = true, length = 32)
    private String loginId;

    /**
     * 手机号码
     */
    @Pattern(regexp="^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$", message="手机号格式错误")
    @Length(max = 20)
    @Column(unique = true, length = 20)
    private String mobile;

    /**
     * 电子邮箱
     */
    @Pattern(regexp="^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w{2,3}){1,3})$", message="邮件地址格式错误")
    @Length(max = 255)
    @Column(unique = true, length = 255)
    private String email;

    /**
     * 登录密码
     */
    @Length(max = 80)
    @Column(length = 80)
    private String password;

    /**
     * 用户的基本信息
     */
    @NotNull
    @OneToOne(optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private final UserDetails details = new UserDetails();

    //////////////////////////////////////////////////
    /// 用户帐号状态
    //////////////////////////////////////////////////
    /**
     * 帐号是否启用
     */
    private boolean enabled = true;

    /**
     * 帐号是否锁定
     */
    private boolean accountLocked = false;

    /**
     * 帐号是否过期
     */
    private boolean accountExpired = false;

    /**
     * 密码是否过期
     */
    private boolean credentialsExpired = false;

    @Override
    public String toString() {
        return String.format("User [id=%s, no=%s, loginId=%s, mobile=%s, email=%s, enabled=%s]",
                this.getId(), this.no, this.loginId, this.mobile, this.email, this.enabled);
    }
}
