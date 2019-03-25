package sample.bizfuse.web.config.security;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import com.leadingsoft.bizfuse.common.webauth.access.DefaultAuthenticationToken;
import com.leadingsoft.bizfuse.common.webauth.access.SimpleGrantedAuthority;
import com.leadingsoft.bizfuse.common.webauth.filter.DefaultAuthenticationFailureHandler;
import com.leadingsoft.bizfuse.common.webauth.filter.DefaultAuthenticationSuccessHandler;
import com.leadingsoft.bizfuse.common.webauth.filter.FilterProcessUrlRequestMatcher;

import sample.bizfuse.web.service.authentication.impl.UserDetailsServiceImpl.UserBean;

public class AccountAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    public static final String USERNAME_KEY = "username";
    public static final String PASSWORD_KEY = "password";

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AccountAuthenticationFilter() {
        super(new FilterProcessUrlRequestMatcher("/login"));
        super.setAuthenticationSuccessHandler(new DefaultAuthenticationSuccessHandler());
        super.setAuthenticationFailureHandler(new DefaultAuthenticationFailureHandler());
    }

    @Override
    public Authentication attemptAuthentication(final HttpServletRequest request, final HttpServletResponse response)
            throws AuthenticationException, IOException, ServletException {

        // 获取请求数据
        final UserBean user = (UserBean)this.userDetailsService
                .loadUserByUsername(request.getParameter(AccountAuthenticationFilter.USERNAME_KEY));
        final String password = request.getParameter(AccountAuthenticationFilter.PASSWORD_KEY);

        // 请求UAP
        if ((user == null) || !this.passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("用户名或密码错误");
        }
        final DefaultAuthenticationToken token = new DefaultAuthenticationToken();
        token.setAuthenticated(true);
        token.setPrincipal(user.getUserNo());
        final Map<String, String> details = new HashMap<>();
        details.put("username", user.getUsername());
        token.setDetails(details); // TODO： 扩展业务属性
        Collection<SimpleGrantedAuthority> roles = user.getAuthorities().stream().map(au -> (SimpleGrantedAuthority)au).collect(Collectors.toList());
        token.setAuthorities(roles);
        return token;
    }
}
