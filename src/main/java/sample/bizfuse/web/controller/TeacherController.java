package sample.bizfuse.web.controller;

import javax.validation.Valid;

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
import sample.bizfuse.web.convertor.TeacherConvertor;
import sample.bizfuse.web.dto.TeacherDTO;
import sample.bizfuse.web.model.Teacher;
import sample.bizfuse.web.repository.TeacherRepository;
import sample.bizfuse.web.service.TeacherService;

/**
 * Teacher的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/teachers")
@Api(tags = {"Teacher管理API" })
public class TeacherController {
    @Autowired
    private TeacherService teacherService;
	@Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private TeacherConvertor teacherConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<TeacherDTO> search(final Pageable pageable) {
        final Page<Teacher> models = this.teacherRepository.findAll(pageable);
        return this.teacherConvertor.toResultDTO(models);
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
    public ResultDTO<TeacherDTO> get(@PathVariable final Long id) {
        final Teacher model = this.teacherService.get(id);
        return this.teacherConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param teacherDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<TeacherDTO> create(@RequestBody @Valid final TeacherDTO teacherDTO) {
        final Teacher model = this.teacherConvertor.toModel(teacherDTO);
        this.teacherService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", Teacher.class.getSimpleName(), model.getId());
        }
        return this.teacherConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param teacherDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<TeacherDTO> update(@PathVariable final Long id, @RequestBody @Valid final TeacherDTO teacherDTO) {
        teacherDTO.setId(id);
        final Teacher model = this.teacherConvertor.toModel(teacherDTO);
        this.teacherService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", Teacher.class.getSimpleName(), model.getId());
        }
        return this.teacherConvertor.toResultDTO(model);
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
        this.teacherService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", Teacher.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
