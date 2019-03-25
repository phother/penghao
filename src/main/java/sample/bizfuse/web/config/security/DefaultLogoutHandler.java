package sample.bizfuse.web.config.security;

import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import com.leadingsoft.bizfuse.common.web.dto.result.ResultDTO;
import com.leadingsoft.bizfuse.common.web.utils.json.JsonUtils;

public class DefaultLogoutHandler implements LogoutHandler {

    private final Log logger = LogFactory.getLog(this.getClass());

    @Override
    public void logout(final HttpServletRequest request, final HttpServletResponse response,
            final Authentication authentication) {

        if (response.isCommitted()) {
            this.logger.debug("Response has already been committed. ");
            return;
        } else {
            final ResultDTO<?> logoutResp = ResultDTO.success();
            try {
                final Writer writer = response.getWriter();
                writer.write(JsonUtils.pojoToJson(logoutResp));
                writer.flush();
                writer.close();
            } catch (final Exception e) {
            }
        }
    }
}
