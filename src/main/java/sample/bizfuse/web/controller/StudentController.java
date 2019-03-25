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
import com.leadingsoft.bizfuse.common.web.support.Searchable;
import com.leadingsoft.bizfuse.common.web.dto.result.PageResultDTO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import sample.bizfuse.web.convertor.StudentConvertor;
import sample.bizfuse.web.dto.StudentDTO;
import sample.bizfuse.web.model.Student;
import sample.bizfuse.web.repository.StudentRepository;
import sample.bizfuse.web.service.StudentService;

/**
 * Student的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/students")
@Api(tags = {"Student管理API" })
public class StudentController {
    @Autowired
    private StudentService studentService;
	@Autowired
    private StudentRepository studentRepository;
    @Autowired
    private StudentConvertor studentConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<StudentDTO> search(final Pageable pageable, Searchable searchable) {
    	Page<Student> models = null;
    	if (searchable.isEmpty()) {
            models = this.studentRepository.findAll(pageable);
    	} else {
    		
    	}
        return this.studentConvertor.toResultDTO(models);
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
    public ResultDTO<StudentDTO> get(@PathVariable final Long id) {
        final Student model = this.studentService.get(id);
        return this.studentConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param studentDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<StudentDTO> create(@RequestBody @Valid final StudentDTO studentDTO) {
        final Student model = this.studentConvertor.toModel(studentDTO);
        this.studentService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", Student.class.getSimpleName(), model.getId());
        }
        return this.studentConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param studentDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<StudentDTO> update(@PathVariable final Long id, @RequestBody @Valid final StudentDTO studentDTO) {
        studentDTO.setId(id);
        final Student model = this.studentConvertor.toModel(studentDTO);
        this.studentService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", Student.class.getSimpleName(), model.getId());
        }
        return this.studentConvertor.toResultDTO(model);
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
        this.studentService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", Student.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
