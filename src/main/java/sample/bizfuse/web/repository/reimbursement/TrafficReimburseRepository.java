package sample.bizfuse.web.repository.reimbursement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.reimbursement.TrafficReimburse;

/**
 * TrafficReimburseRepository
 */
public interface TrafficReimburseRepository extends Repository<TrafficReimburse, Long> {

    Page<TrafficReimburse> findAll(Pageable pageable);

    TrafficReimburse findOne(Long id);

    TrafficReimburse save(TrafficReimburse model);

    void delete(Long id);

}
