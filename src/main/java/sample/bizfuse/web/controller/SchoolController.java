package sample.bizfuse.web.controller;

import javax.validation.Valid;

import com.leadingsoft.bizfuse.common.webauth.annotation.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.leadingsoft.bizfuse.common.web.dto.result.ResultDTO;
import com.leadingsoft.bizfuse.common.web.dto.result.PageResultDTO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import sample.bizfuse.web.convertor.SchoolConvertor;
import sample.bizfuse.web.dto.SchoolDTO;
import sample.bizfuse.web.model.School;
import sample.bizfuse.web.model.authentication.User;
import sample.bizfuse.web.repository.SchoolRepository;
import sample.bizfuse.web.service.SchoolService;

/**
 * School的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/schools")
@Api(tags = {"School管理API" })
public class SchoolController {
    @Autowired
    private SchoolService schoolService;
	@Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private SchoolConvertor schoolConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<SchoolDTO> search(final Pageable pageable, @CurrentUser User user) {

        final Page<School> models = this.schoolRepository.findAll(pageable);
        return this.schoolConvertor.toResultDTO(models);
    }

    /**
     * 取得详细数据
     *
     * @param id 资源ID
     * @return 资源详细
     */
    @Timed
    @ApiOperation(value = "获取详细数据", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<SchoolDTO> get(@PathVariable final Long id,@CurrentUser User user) {
        final School model = this.schoolService.get(id);
        return this.schoolConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param schoolDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<SchoolDTO> create(@RequestBody @Valid final SchoolDTO schoolDTO) {
        final School model = this.schoolConvertor.toModel(schoolDTO);
        this.schoolService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", School.class.getSimpleName(), model.getId());
        }
        return this.schoolConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param schoolDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<SchoolDTO> update(@PathVariable final Long id, @RequestBody @Valid final SchoolDTO schoolDTO) {
        schoolDTO.setId(id);
        final School model = this.schoolConvertor.toModel(schoolDTO);
        this.schoolService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", School.class.getSimpleName(), model.getId());
        }
        return this.schoolConvertor.toResultDTO(model);
    }

    /**
     * 删除操作
     *
     * @param Id 资源ID
     * @return 操作结果
     */
    @Timed
    @ApiOperation(value = "删除操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<Void> delete(@PathVariable final Long id) {
        this.schoolService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", School.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
