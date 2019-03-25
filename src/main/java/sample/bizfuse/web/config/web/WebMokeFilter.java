package sample.bizfuse.web.config.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.h2.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

/**
 * WEB请求的Moke过滤器
 * <p>
 * 目的是针对前端页面的Request，后端未实现API的，可以通过造数据文件（.json）的方式模拟后端返回结果，优先开发。</br>
 * 如果后端实现了API，返回后端API处理结果
 * @author liuyg
 *
 */
public class WebMokeFilter implements Filter {
    private static final Logger log = LoggerFactory.getLogger(WebMokeFilter.class);

    // 默认内部URI列表
    private final Set<String> defaultInternalUris = new HashSet<>();

    // 内部URL的Handler Mapping
    private RequestMappingHandlerMapping internalHandlerMapping;

    @Override
    public void init(final FilterConfig filterConfig) throws ServletException {
        this.defaultInternalUris.add("^/$");
        this.defaultInternalUris.add("^/favicon.ico$");
        this.defaultInternalUris.add("/bower_components/");
        this.defaultInternalUris.add("/assets/");
        this.defaultInternalUris.add("\\.html");
        this.defaultInternalUris.add("\\.js");
        this.defaultInternalUris.add("\\.css");
        this.defaultInternalUris.add("\\.jpg");
        this.defaultInternalUris.add("\\.png");
    }

    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
            throws IOException, ServletException {
        final HttpServletRequest req = (HttpServletRequest) request;
        final HttpServletResponse resp = (HttpServletResponse) response;
        if (this.isInternalRequest(req)) {
        	chain.doFilter(req, resp);
        } else {
        	this.doRequestMoke(req, resp);
        }
    }

    private void doRequestMoke(final HttpServletRequest req, final HttpServletResponse resp) {
    	final String uri = req.getRequestURI();
    	String fileClassPath = "/static/data" + uri + ".json";
    	ClassPathResource rs = new ClassPathResource(fileClassPath);
    	try (InputStream in = rs.getInputStream();) {
			OutputStream out = resp.getOutputStream();
			resp.setContentType(req.getContentType());
			IOUtils.copy(in, out);
			resp.flushBuffer();
			return;
		} catch (IOException e) {
			// 返回异常
		}
    	resp.setStatus(404);
		try {
			resp.flushBuffer();
		} catch (IOException e1) {
		}
    }

    @Override
    public void destroy() {
    }

    /**
     * 判断是否内部请求
     */
    private boolean isInternalRequest(final HttpServletRequest req) {
        final String uri = req.getRequestURI();
        if (this.defaultInternalUris.stream().anyMatch(p -> Pattern.compile(p).matcher(uri).find())) {
            return true;
        }
        try {
            final HandlerExecutionChain handler = this.internalHandlerMapping.getHandler(req);
            if (handler == null) {
                return false;
            } else {
                return true;
            }
        } catch (final Exception e) {
            WebMokeFilter.log.debug("获取Request的Handler发生异常.", e);
            return false;
        }
    }

    public void setHandlerMapping(final RequestMappingHandlerMapping handlerMapping) {
        this.internalHandlerMapping = handlerMapping;
    }
}