package sample.bizfuse.web.controller.base;

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

import sample.bizfuse.web.convertor.base.DepartmentConvertor;
import sample.bizfuse.web.dto.base.DepartmentDTO;
import sample.bizfuse.web.model.base.Department;
import sample.bizfuse.web.service.base.DepartmentService;
import sample.bizfuse.web.repository.base.DepartmentRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * Department的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/departments")
@Api(tags = {"Department管理API" })
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;
	@Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private DepartmentConvertor departmentConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<DepartmentDTO> search(final Pageable pageable) {
        final Page<Department> models = this.departmentRepository.findAll(pageable);
        return this.departmentConvertor.toResultDTO(models);
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
    public ResultDTO<DepartmentDTO> get(@PathVariable final Long id) {
        final Department model = this.departmentService.get(id);
        return this.departmentConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param departmentDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<DepartmentDTO> create(@RequestBody @Valid final DepartmentDTO departmentDTO) {
        final Department model = this.departmentConvertor.toModel(departmentDTO);
        this.departmentService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", Department.class.getSimpleName(), model.getId());
        }
        return this.departmentConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param departmentDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<DepartmentDTO> update(@PathVariable final Long id, @RequestBody @Valid final DepartmentDTO departmentDTO) {
        departmentDTO.setId(id);
        final Department model = this.departmentConvertor.toModel(departmentDTO);
        this.departmentService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", Department.class.getSimpleName(), model.getId());
        }
        return this.departmentConvertor.toResultDTO(model);
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
        this.departmentService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", Department.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
