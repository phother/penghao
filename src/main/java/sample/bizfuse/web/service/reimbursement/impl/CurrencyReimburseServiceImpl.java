package sample.bizfuse.web.service.reimbursement.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;
import sample.bizfuse.web.service.reimbursement.CurrencyReimburseService;
import sample.bizfuse.web.model.reimbursement.CurrencyReimburse;
import sample.bizfuse.web.repository.reimbursement.CurrencyReimburseRepository;
import lombok.NonNull;

/**
 * CurrencyReimburseService 实现类
 */
@Service
@Transactional
public class CurrencyReimburseServiceImpl implements CurrencyReimburseService {

    @Autowired
    private CurrencyReimburseRepository currencyReimburseRepository;

    @Override
    @Transactional(readOnly = true)
    public CurrencyReimburse get(@NonNull Long id) {
        final  CurrencyReimburse model = currencyReimburseRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public CurrencyReimburse create(CurrencyReimburse model) {
        // TODO: 业务逻辑
        return currencyReimburseRepository.save(model);
    }

    @Override
    public CurrencyReimburse update(CurrencyReimburse model) {
        // TODO: 业务逻辑
        return currencyReimburseRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        currencyReimburseRepository.delete(id);
    }
}
