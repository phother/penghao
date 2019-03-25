package sample.bizfuse.web.repository.reimbursement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.reimbursement.CurrencyReimburse;

/**
 * CurrencyReimburseRepository
 */
public interface CurrencyReimburseRepository extends Repository<CurrencyReimburse, Long> {

    Page<CurrencyReimburse> findAll(Pageable pageable);

    CurrencyReimburse findOne(Long id);

    CurrencyReimburse save(CurrencyReimburse model);

    void delete(Long id);

}
