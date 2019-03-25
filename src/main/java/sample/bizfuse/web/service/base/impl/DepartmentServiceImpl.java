package sample.bizfuse.web.service.base.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;
import sample.bizfuse.web.service.base.DepartmentService;
import sample.bizfuse.web.model.base.Department;
import sample.bizfuse.web.repository.base.DepartmentRepository;
import lombok.NonNull;

/**
 * DepartmentService 实现类
 */
@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public Department get(@NonNull Long id) {
        final  Department model = departmentRepository.findOne(id);
        if (model == null) {
            throw new CustomRuntimeException("404", String.format("查找的资源[%s]不存在.", id));
        }
        return model;
    }

    @Override
    public Department create(Department model) {
        // TODO: 业务逻辑
        return departmentRepository.save(model);
    }

    @Override
    public Department update(Department model) {
        // TODO: 业务逻辑
        return departmentRepository.save(model);
    }

    @Override
    public void delete(@NonNull Long id) {
        // TODO: 业务逻辑
        departmentRepository.delete(id);
    }
}
