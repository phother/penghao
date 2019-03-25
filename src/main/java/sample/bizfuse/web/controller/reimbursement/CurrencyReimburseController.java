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

import sample.bizfuse.web.convertor.reimbursement.CurrencyReimburseConvertor;
import sample.bizfuse.web.dto.reimbursement.CurrencyReimburseDTO;
import sample.bizfuse.web.model.reimbursement.CurrencyReimburse;
import sample.bizfuse.web.service.reimbursement.CurrencyReimburseService;
import sample.bizfuse.web.repository.reimbursement.CurrencyReimburseRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * CurrencyReimburse的管理接口
 *
 * @author auto
 */
 @Slf4j
@RestController
@RequestMapping("/w/currencyReimburses")
@Api(tags = {"CurrencyReimburse管理API" })
public class CurrencyReimburseController {
    @Autowired
    private CurrencyReimburseService currencyReimburseService;
	@Autowired
    private CurrencyReimburseRepository currencyReimburseRepository;
    @Autowired
    private CurrencyReimburseConvertor currencyReimburseConvertor;

    /**
     * 获取分页数据
     *
     * @param pageable 分页+排序参数
     * @return 分页数据
     */
    @Timed
    @ApiOperation(value = "获取分页数据", notes = "")
    @RequestMapping(value = "/s", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResultDTO<CurrencyReimburseDTO> search(final Pageable pageable) {
        final Page<CurrencyReimburse> models = this.currencyReimburseRepository.findAll(pageable);
        return this.currencyReimburseConvertor.toResultDTO(models);
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
    public ResultDTO<CurrencyReimburseDTO> get(@PathVariable final Long id) {
        final CurrencyReimburse model = this.currencyReimburseService.get(id);
        return this.currencyReimburseConvertor.toResultDTO(model);
    }

    /**
     * 新建操作
     *
     * @param currencyReimburseDTO 新建资源的DTO
     * @return 新建资源
     */
    @Timed
    @ApiOperation(value = "新建操作", notes = "")
    @RequestMapping(method = RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<CurrencyReimburseDTO> create(@RequestBody @Valid final CurrencyReimburseDTO currencyReimburseDTO) {
        final CurrencyReimburse model = this.currencyReimburseConvertor.toModel(currencyReimburseDTO);
        this.currencyReimburseService.create(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was created.", CurrencyReimburse.class.getSimpleName(), model.getId());
        }
        return this.currencyReimburseConvertor.toResultDTO(model);
    }
    
    /**
     * 更新操作
     *
     * @param id 更新资源的ID
     * @param currencyReimburseDTO 更新资源的DTO
     * @return 更新后资源
     */
    @Timed
    @ApiOperation(value = "更新操作", notes = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResultDTO<CurrencyReimburseDTO> update(@PathVariable final Long id, @RequestBody @Valid final CurrencyReimburseDTO currencyReimburseDTO) {
        currencyReimburseDTO.setId(id);
        final CurrencyReimburse model = this.currencyReimburseConvertor.toModel(currencyReimburseDTO);
        this.currencyReimburseService.update(model);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was updated.", CurrencyReimburse.class.getSimpleName(), model.getId());
        }
        return this.currencyReimburseConvertor.toResultDTO(model);
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
        this.currencyReimburseService.delete(id);
        if (log.isInfoEnabled()) {
            log.info("{} instance {} was deleted.", CurrencyReimburse.class.getSimpleName(), id);
        }
        return ResultDTO.success();
    }
}
