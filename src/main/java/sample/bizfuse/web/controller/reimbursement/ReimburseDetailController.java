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

import sample.bizfuse.web.convertor.reimbursement.ReimburseDetailConvertor;
import sample.bizfuse.web.dto.reimbursement.ReimburseDetailDTO;
import sample.bizfuse.web.model.reimbursement.ReimburseDetail;
import sample.bizfuse.web.service.reimbursement.ReimburseDetailService;
import sample.bizfuse.web.repository.reimbursement.ReimburseDetailRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * ReimburseDetail的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/reimburseDetails")
@Api(tags = {"ReimburseDetail管理API" })
public class ReimburseDetailController {
    @Autowired
    private ReimburseDetailService reimburseDetailService;
	@Autowired
    private ReimburseDetailRepository reimburseDetailRepository;
    @Autowired
    private ReimburseDetailConvertor reimburseDetailConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<ReimburseDetailDTO> search(final Pageable pageable) {
        final Page<ReimburseDetail> models = this.reimburseDetailRepository.findAll(pageable);
        return this.reimburseDetailConvertor.toResultDTO(models);
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
    public ResultDTO<ReimburseDetailDTO> get(@PathVariable final Long id) {
        final ReimburseDetail model = this.reimburseDetailService.get(id);
        return this.reimburseDetailConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param reimburseDetailDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<ReimburseDetailDTO> create(@RequestBody @Valid final ReimburseDetailDTO reimburseDetailDTO) {
        final ReimburseDetail model = this.reimburseDetailConvertor.toModel(reimburseDetailDTO);
        this.reimburseDetailService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", ReimburseDetail.class.getSimpleName(), model.getId());
        }
        return this.reimburseDetailConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param reimburseDetailDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<ReimburseDetailDTO> update(@PathVariable final Long id, @RequestBody @Valid final ReimburseDetailDTO reimburseDetailDTO) {
        reimburseDetailDTO.setId(id);
        final ReimburseDetail model = this.reimburseDetailConvertor.toModel(reimburseDetailDTO);
        this.reimburseDetailService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", ReimburseDetail.class.getSimpleName(), model.getId());
        }
        return this.reimburseDetailConvertor.toResultDTO(model);
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
        this.reimburseDetailService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", ReimburseDetail.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
