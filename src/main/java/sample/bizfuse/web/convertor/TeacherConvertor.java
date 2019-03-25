package sample.bizfuse.web.convertor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;

import lombok.NonNull;
import sample.bizfuse.web.dto.TeacherDTO;
import sample.bizfuse.web.model.Teacher;
import sample.bizfuse.web.service.TeacherService;

/**
 * TeacherConvertor
 */
@Component
public class TeacherConvertor extends AbstractConvertor<Teacher, TeacherDTO> {

    @Autowired
    private TeacherService teacherService;
    
    @Override
    public Teacher toModel(@NonNull final TeacherDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public TeacherDTO toDTO(@NonNull final Teacher model, final boolean forListView) {
        final TeacherDTO dto = new TeacherDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setAge(model.getAge());
        dto.setTeachingAge(model.getTeachingAge());
        dto.setLevel(model.getLevel());

        return dto;
    }

    // 构建新Model
    private Teacher constructModel(final TeacherDTO dto) {
        Teacher model = new Teacher();
        model.setName(dto.getName());
        model.setAge(dto.getAge());
        model.setTeachingAge(dto.getTeachingAge());
        model.setLevel(dto.getLevel());

        return model;
    }

    // 更新Model
    private Teacher updateModel(final TeacherDTO dto) {
        Teacher model = teacherService.get(dto.getId());
        model.setName(dto.getName());
        model.setAge(dto.getAge());
        model.setTeachingAge(dto.getTeachingAge());
        model.setLevel(dto.getLevel());
        
        return model;
    }
}
