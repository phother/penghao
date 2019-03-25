package sample.bizfuse.web.repository.reimbursement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.reimbursement.TravelReimburse;

/**
 * TravelReimburseRepository
 */
public interface TravelReimburseRepository extends Repository<TravelReimburse, Long> {

    Page<TravelReimburse> findAll(Pageable pageable);

    TravelReimburse findOne(Long id);

    TravelReimburse save(TravelReimburse model);

    void delete(Long id);

}
