package sample.bizfuse.web.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.Teacher;

/**
 * TeacherRepository
 */
public interface TeacherRepository extends Repository<Teacher, Long> {

    Page<Teacher> findAll(Pageable pageable);

    Teacher findOne(Long id);

    Teacher save(Teacher model);

    void delete(Long id);

}
