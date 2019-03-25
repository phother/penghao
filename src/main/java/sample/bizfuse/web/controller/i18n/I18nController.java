package sample.bizfuse.web.controller.i18n;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.leadingsoft.bizfuse.common.web.dto.result.ResultDTO;
import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 国际化的测试接口
 *
 * @author liuyg
 */
@Slf4j
@RestController
@RequestMapping("/api/i18n")
@Api(tags = {"异常消息国际化测试API" })
public class I18nController {

    /**
     * 测试接口：异常系， 测试i18n国际化
     *
     * @return
     */
    @Timed
    @ApiOperation(value = "异常消息的国际化测试", notes = "")
    @RequestMapping(value = "/errormsg", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<Void> error() {
        log.info("异常消息的国际化测试.");
        throw new CustomRuntimeException("test.exception.i18n", "test error message i18n.");
    }
    
    /**
     * 测试接口：异常系， 测试i18n国际化配置文件未定义的，输出默认消息
     *
     * @return
     */
    @Timed
    @ApiOperation(value = "异常消息的国际化测试", notes = "")
    @RequestMapping(value = "/defaultmsg", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<Void> defaultErrorMsg() {
        log.info("异常消息的国际化测试.");
        throw new CustomRuntimeException("test.default.msg", "i18n未定义的消息，返回默认消息.");
    }
}
