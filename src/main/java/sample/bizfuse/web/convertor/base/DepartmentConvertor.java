package sample.bizfuse.web.convertor.base;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;
import sample.bizfuse.web.dto.base.DepartmentDTO;
import sample.bizfuse.web.model.base.Department;
import sample.bizfuse.web.service.base.DepartmentService;
import lombok.NonNull;

/**
 * DepartmentConvertor
 */
@Component
public class DepartmentConvertor extends AbstractConvertor<Department, DepartmentDTO> {

    @Autowired
    private DepartmentService departmentService;
    
    @Override
    public Department toModel(@NonNull final DepartmentDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public DepartmentDTO toDTO(@NonNull final Department model, final boolean forListView) {
        final DepartmentDTO dto = new DepartmentDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setDescription(model.getDescription());

        return dto;
    }

    // 构建新Model
    private Department constructModel(final DepartmentDTO dto) {
        Department model = new Department();
        model.setName(dto.getName());
        model.setDescription(dto.getDescription());

        return model;
    }

    // 更新Model
    private Department updateModel(final DepartmentDTO dto) {
        Department model = departmentService.get(dto.getId());
        model.setName(dto.getName());
        model.setDescription(dto.getDescription());

        return model;
    }
}
