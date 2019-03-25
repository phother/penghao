package sample.bizfuse.web.service.reimbursement.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;
import sample.bizfuse.web.service.reimbursement.TrafficReimburseService;
import sample.bizfuse.web.model.reimbursement.TrafficReimburse;
import sample.bizfuse.web.repository.reimbursement.TrafficReimburseRepository;
import lombok.NonNull;

/**
 * TrafficReimburseService 实现类
 */
@Service
@Transactional
public class TrafficReimburseServiceImpl implements TrafficReimburseService {

    @Autowired
    private TrafficReimburseRepository trafficReimburseRepository;

    @Override
    @Transactional(readOnly = true)
    public TrafficReimburse get(@NonNull Long id) {
        final  TrafficReimburse model = trafficReimburseRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public TrafficReimburse create(TrafficReimburse model) {
        // TODO: 业务逻辑
        return trafficReimburseRepository.save(model);
    }

    @Override
    public TrafficReimburse update(TrafficReimburse model) {
        // TODO: 业务逻辑
        return trafficReimburseRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        trafficReimburseRepository.delete(id);
    }
}
