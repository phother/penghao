package sample.bizfuse.web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;

import lombok.NonNull;
import sample.bizfuse.web.model.Teacher;
import sample.bizfuse.web.repository.TeacherRepository;
import sample.bizfuse.web.service.TeacherService;

/**
 * TeacherService 实现类
 */
@Service
@Transactional
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    @Transactional(readOnly = true)
    public Teacher get(@NonNull Long id) {
        final  Teacher model = teacherRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public Teacher create(Teacher model) {
        // TODO: 业务逻辑
        return teacherRepository.save(model);
    }

    @Override
    public Teacher update(Teacher model) {
        // TODO: 业务逻辑
        return teacherRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        teacherRepository.delete(id);
    }
}
