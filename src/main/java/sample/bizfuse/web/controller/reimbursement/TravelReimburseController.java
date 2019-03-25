package sample.bizfuse.web.controller.reimbursement;

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

import sample.bizfuse.web.convertor.reimbursement.TravelReimburseConvertor;
import sample.bizfuse.web.dto.reimbursement.TravelReimburseDTO;
import sample.bizfuse.web.model.reimbursement.TravelReimburse;
import sample.bizfuse.web.service.reimbursement.TravelReimburseService;
import sample.bizfuse.web.repository.reimbursement.TravelReimburseRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * TravelReimburse的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/travelReimburses")
@Api(tags = {"TravelReimburse管理API" })
public class TravelReimburseController {
    @Autowired
    private TravelReimburseService travelReimburseService;
	@Autowired
    private TravelReimburseRepository travelReimburseRepository;
    @Autowired
    private TravelReimburseConvertor travelReimburseConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<TravelReimburseDTO> search(final Pageable pageable) {
        final Page<TravelReimburse> models = this.travelReimburseRepository.findAll(pageable);
        return this.travelReimburseConvertor.toResultDTO(models);
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
    public ResultDTO<TravelReimburseDTO> get(@PathVariable final Long id) {
        final TravelReimburse model = this.travelReimburseService.get(id);
        return this.travelReimburseConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param travelReimburseDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<TravelReimburseDTO> create(@RequestBody @Valid final TravelReimburseDTO travelReimburseDTO) {
        final TravelReimburse model = this.travelReimburseConvertor.toModel(travelReimburseDTO);
        this.travelReimburseService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", TravelReimburse.class.getSimpleName(), model.getId());
        }
        return this.travelReimburseConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param travelReimburseDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<TravelReimburseDTO> update(@PathVariable final Long id, @RequestBody @Valid final TravelReimburseDTO travelReimburseDTO) {
        travelReimburseDTO.setId(id);
        final TravelReimburse model = this.travelReimburseConvertor.toModel(travelReimburseDTO);
        this.travelReimburseService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", TravelReimburse.class.getSimpleName(), model.getId());
        }
        return this.travelReimburseConvertor.toResultDTO(model);
    }

    /**
     * 删除操作
     *
     * @param id 资源ID
     * @return 操作结果
     */
    @Timed
    @ApiOperation(value = "删除操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<Void> delete(@PathVariable final Long id) {
        this.travelReimburseService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", TravelReimburse.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
