package sample.bizfuse.web.service.reimbursement.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;
import sample.bizfuse.web.service.reimbursement.ReimburseDetailService;
import sample.bizfuse.web.model.reimbursement.ReimburseDetail;
import sample.bizfuse.web.repository.reimbursement.ReimburseDetailRepository;
import lombok.NonNull;

/**
 * ReimburseDetailService 实现类
 */
@Service
@Transactional
public class ReimburseDetailServiceImpl implements ReimburseDetailService {

    @Autowired
    private ReimburseDetailRepository reimburseDetailRepository;

    @Override
    @Transactional(readOnly = true)
    public ReimburseDetail get(@NonNull Long id) {
        final  ReimburseDetail model = reimburseDetailRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public ReimburseDetail create(ReimburseDetail model) {
        // TODO: 业务逻辑
        return reimburseDetailRepository.save(model);
    }

    @Override
    public ReimburseDetail update(ReimburseDetail model) {
        // TODO: 业务逻辑
        return reimburseDetailRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        reimburseDetailRepository.delete(id);
    }
}
