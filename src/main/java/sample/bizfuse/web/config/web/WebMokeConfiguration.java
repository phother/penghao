package sample.bizfuse.web.config.web;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Configuration
public class WebMokeConfiguration {

	@Bean
    public FilterRegistrationBean mappingFilter(RequestMappingHandlerMapping handlerMapping) {
        final FilterRegistrationBean mf = new FilterRegistrationBean();
        final WebMokeFilter filter = new WebMokeFilter();
        mf.setFilter(filter);
        mf.addUrlPatterns("/*");
        mf.setOrder(Ordered.LOWEST_PRECEDENCE);
        filter.setHandlerMapping(handlerMapping);
        return mf;
    }
}
