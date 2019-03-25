package sample.bizfuse.web.config.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.servlet.MultipartConfigElement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.filter.OrderedCharacterEncodingFilter;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Controller;
import org.springframework.web.accept.ContentNegotiationManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import com.leadingsoft.bizfuse.common.web.annotation.EnableBizfuseWebMVC;
import com.leadingsoft.bizfuse.common.web.view.DefaultListDataExcelView;

/**
 * Created by liuyg on 17-2-23.
 */
@Controller
@Configuration
@EnableBizfuseWebMVC
public class WebConfiguration {

	@Value("${local.storage.tmp}")
	private String multipartLocation;

	@Autowired
	private ApplicationContext applicationContext;

	/**
	 * UTF-8 charset filter
	 * 
	 * @return
	 */
	@Bean
	public OrderedCharacterEncodingFilter characterEncodingFilter() {
		OrderedCharacterEncodingFilter characterEncodingFilter = new OrderedCharacterEncodingFilter();
		characterEncodingFilter.setEncoding("UTF-8");
		characterEncodingFilter.setForceEncoding(true);
		characterEncodingFilter.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return characterEncodingFilter;
	}

	@RequestMapping(value="/")
	public String homePage() {
		return "forward:/index.html";
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////
	//// 以下为Excel数据导出配置
	/////////////////////////////////////////////////////////////////////////////////////////////////
	@Bean
	public ViewResolver contentNegotiatingViewResolver(final ContentNegotiationManager manager) {
		final ContentNegotiatingViewResolver resolver = new ContentNegotiatingViewResolver();
		resolver.setContentNegotiationManager(manager);
		// Define all possible view resolvers
		final List<ViewResolver> resolvers = new ArrayList<ViewResolver>();
		resolvers.add(this.excelViewResolver());
		resolver.setViewResolvers(resolvers);
		return resolver;
	}

	@Bean
	public ViewResolver excelViewResolver() {
		return new ViewResolver() {
			@Override
			public View resolveViewName(final String viewName, final Locale locale) throws Exception {
				if (!applicationContext.containsBean(viewName)) {
					return null;
				}
				final Object bean = applicationContext.getBean(viewName);
				if (!(bean instanceof AbstractXlsView)) {
					return null;
				}
				return (View) bean;
			}
		};
	}

	@Bean
	public DefaultListDataExcelView defaultListDataExcelView() {
		return new DefaultListDataExcelView();
	}

	@Bean
	public MultipartConfigElement multipartConfigElement() {
		final MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize("20MB");
		factory.setMaxRequestSize("20MB");
		factory.setLocation(this.multipartLocation);
		return factory.createMultipartConfig();
	}
}
