package sample.bizfuse.web.convertor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;

import lombok.NonNull;
import sample.bizfuse.web.dto.SchoolDTO;
import sample.bizfuse.web.model.School;
import sample.bizfuse.web.service.SchoolService;

/**
 * SchoolConvertor
 */
@Component
public class SchoolConvertor extends AbstractConvertor<School, SchoolDTO> {

    @Autowired
    private SchoolService schoolService;
    
    @Override
    public School toModel(@NonNull final SchoolDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public SchoolDTO toDTO(@NonNull final School model, final boolean forListView) {
        final SchoolDTO dto = new SchoolDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setAddress(model.getAddress());

        return dto;
    }

    // 构建新Model
    private School constructModel(final SchoolDTO dto) {
        School model = new School();
        model.setName(dto.getName());
        model.setAddress(dto.getAddress());

        return model;
    }

    // 更新Model
    private School updateModel(final SchoolDTO dto) {
        School model = schoolService.get(dto.getId());
        model.setName(dto.getName());
        model.setAddress(dto.getAddress());

        return model;
    }
}
