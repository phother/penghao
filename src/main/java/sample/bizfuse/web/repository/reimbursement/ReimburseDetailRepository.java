package sample.bizfuse.web.repository.reimbursement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.reimbursement.ReimburseDetail;

/**
 * ReimburseDetailRepository
 */
public interface ReimburseDetailRepository extends Repository<ReimburseDetail, Long> {

    Page<ReimburseDetail> findAll(Pageable pageable);

    ReimburseDetail findOne(Long id);

    ReimburseDetail save(ReimburseDetail model);

    void delete(Long id);

}
