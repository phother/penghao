package sample.bizfuse.web.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.School;

/**
 * SchoolRepository
 */
public interface SchoolRepository extends Repository<School, Long> {

    Page<School> findAll(Pageable pageable);

    School findOne(Long id);

    School save(School model);

    void delete(Long id);

}
