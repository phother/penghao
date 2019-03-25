package sample.bizfuse.web.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.leadingsoft.bizfuse.common.webauth.annotation.EnableBizfuseWebAuth;
import com.leadingsoft.bizfuse.common.webauth.config.jwt.Http401UnauthorizedEntryPoint;

/**
 * Spring Security 配置
 * @author liuyg
 *
 */
@Configuration
@EnableBizfuseWebAuth
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Autowired
    private Http401UnauthorizedEntryPoint authenticationEntryPoint;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AccountAuthenticationFilter accountAuthenticationFilter() {
        final AccountAuthenticationFilter filter = new AccountAuthenticationFilter();
        filter.setAuthenticationManager(this.authenticationManager);
        return filter;
    }

    @Override
    public void configure(final WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/")
            .antMatchers("/*.html")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/bower_components/**")
            .antMatchers("/assets/**")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/swagger-ui.html")
            .antMatchers("/test/**")
            .antMatchers("/upload.html")
            .antMatchers("/h2-console/**");
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {

        http
            .exceptionHandling()
            .authenticationEntryPoint(this.authenticationEntryPoint)
            .and()
            .csrf()
            .disable()
            .headers()
            .frameOptions()
            .disable()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 如果是API Gateway，应该使用Session策略， 如果是后台微服务， 应该使用无Session策略
            .and()
            .authorizeRequests()
            .antMatchers("/upload/**").permitAll()//文件上传
            .antMatchers("/download/**").permitAll()//文件下载
            .antMatchers("/w/checkLogin").permitAll()//校验用户是否登录
            .antMatchers("/api/**").authenticated()
            .antMatchers("/management/**").hasAuthority("admin")
            .anyRequest().authenticated()
            .and()
            .logout()
            .logoutUrl("/logout").addLogoutHandler(new DefaultLogoutHandler())
            .deleteCookies("remember-me", "JSESSIONID")
            .and()
            .addFilterBefore(accountAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
