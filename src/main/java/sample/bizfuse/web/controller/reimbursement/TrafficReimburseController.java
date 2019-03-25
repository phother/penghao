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

import sample.bizfuse.web.convertor.reimbursement.TrafficReimburseConvertor;
import sample.bizfuse.web.dto.reimbursement.TrafficReimburseDTO;
import sample.bizfuse.web.model.reimbursement.TrafficReimburse;
import sample.bizfuse.web.service.reimbursement.TrafficReimburseService;
import sample.bizfuse.web.repository.reimbursement.TrafficReimburseRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * TrafficReimburse的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/trafficReimburses")
@Api(tags = {"TrafficReimburse管理API" })
public class TrafficReimburseController {
    @Autowired
    private TrafficReimburseService trafficReimburseService;
	@Autowired
    private TrafficReimburseRepository trafficReimburseRepository;
    @Autowired
    private TrafficReimburseConvertor trafficReimburseConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<TrafficReimburseDTO> search(final Pageable pageable) {
        final Page<TrafficReimburse> models = this.trafficReimburseRepository.findAll(pageable);
        return this.trafficReimburseConvertor.toResultDTO(models);
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
    public ResultDTO<TrafficReimburseDTO> get(@PathVariable final Long id) {
        final TrafficReimburse model = this.trafficReimburseService.get(id);
        return this.trafficReimburseConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param trafficReimburseDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<TrafficReimburseDTO> create(@RequestBody @Valid final TrafficReimburseDTO trafficReimburseDTO) {
        final TrafficReimburse model = this.trafficReimburseConvertor.toModel(trafficReimburseDTO);
        this.trafficReimburseService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", TrafficReimburse.class.getSimpleName(), model.getId());
        }
        return this.trafficReimburseConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param trafficReimburseDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<TrafficReimburseDTO> update(@PathVariable final Long id, @RequestBody @Valid final TrafficReimburseDTO trafficReimburseDTO) {
        trafficReimburseDTO.setId(id);
        final TrafficReimburse model = this.trafficReimburseConvertor.toModel(trafficReimburseDTO);
        this.trafficReimburseService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", TrafficReimburse.class.getSimpleName(), model.getId());
        }
        return this.trafficReimburseConvertor.toResultDTO(model);
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
        this.trafficReimburseService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", TrafficReimburse.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
