package sample.bizfuse.web.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import sample.bizfuse.web.model.Student;

/**
 * StudentRepository
 */
public interface StudentRepository extends Repository<Student, Long>, StudentRepositoryCustom {

    Page<Student> findAll(Pageable pageable);
    
    List<Student> findAll();

    Student findOne(Long id);

    Student save(Student model);

    void delete(Long id);

}
