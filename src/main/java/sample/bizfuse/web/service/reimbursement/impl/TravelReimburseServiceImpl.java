package sample.bizfuse.web.service.reimbursement.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;
import sample.bizfuse.web.service.reimbursement.TravelReimburseService;
import sample.bizfuse.web.model.reimbursement.TravelReimburse;
import sample.bizfuse.web.repository.reimbursement.TravelReimburseRepository;
import lombok.NonNull;

/**
 * TravelReimburseService 实现类
 */
@Service
@Transactional
public class TravelReimburseServiceImpl implements TravelReimburseService {

    @Autowired
    private TravelReimburseRepository travelReimburseRepository;

    @Override
    @Transactional(readOnly = true)
    public TravelReimburse get(@NonNull Long id) {
        final  TravelReimburse model = travelReimburseRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public TravelReimburse create(TravelReimburse model) {
        // TODO: 业务逻辑
        return travelReimburseRepository.save(model);
    }

    @Override
    public TravelReimburse update(TravelReimburse model) {
        // TODO: 业务逻辑
        return travelReimburseRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        travelReimburseRepository.delete(id);
    }
}
