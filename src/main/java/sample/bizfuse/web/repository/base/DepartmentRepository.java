package sample.bizfuse.web.repository.base;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.base.Department;

/**
 * DepartmentRepository
 */
public interface DepartmentRepository extends Repository<Department, Long> {

    Page<Department> findAll(Pageable pageable);

    Department findOne(Long id);

    Department save(Department model);

    void delete(Long id);

}
