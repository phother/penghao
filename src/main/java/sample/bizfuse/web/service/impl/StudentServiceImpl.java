package sample.bizfuse.web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;

import lombok.NonNull;
import sample.bizfuse.web.model.Student;
import sample.bizfuse.web.repository.StudentRepository;
import sample.bizfuse.web.service.StudentService;

/**
 * StudentService 实现类
 */
@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    public Student get(@NonNull Long id) {
        final  Student model = studentRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public Student create(Student model) {
        // TODO: 业务逻辑
        return studentRepository.save(model);
    }

    @Override
    public Student update(Student model) {
        // TODO: 业务逻辑
        return studentRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        studentRepository.delete(id);
    }
}
