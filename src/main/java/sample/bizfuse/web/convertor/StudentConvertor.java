package sample.bizfuse.web.convertor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;

import lombok.NonNull;
import sample.bizfuse.web.dto.StudentDTO;
import sample.bizfuse.web.dto.StudentProfileDTO;
import sample.bizfuse.web.model.Student;
import sample.bizfuse.web.model.StudentProfile;
import sample.bizfuse.web.service.SchoolService;
import sample.bizfuse.web.service.StudentService;

/**
 * StudentConvertor
 */
@Component
public class StudentConvertor extends AbstractConvertor<Student, StudentDTO> {

    @Autowired
    private StudentService studentService;
    @Autowired
    private SchoolService schoolService;
    
    @Override
    public Student toModel(@NonNull final StudentDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public StudentDTO toDTO(@NonNull final Student model, final boolean forListView) {
    	final StudentDTO dto = new StudentDTO();
        dto.setId(model.getId());
        dto.setSchoolId(model.getSchool().getId());
        dto.setSchoolName(model.getSchool().getName());
        dto.setName(model.getName());
        dto.setGrade(model.getGrade());
        dto.setGraduate(model.isGraduate());
    	if (!forListView) { // 详细
    		dto.setProfile(this.toProfileDTO(model.getProfile()));
    	}
        return dto;
    }

    // 构建新Model
    private Student constructModel(final StudentDTO dto) {
        Student model = new Student();
        model.setName(dto.getName());
        model.setGrade(dto.getGrade());
        model.setGraduate(dto.isGraduate());
        model.setSchool(this.schoolService.get(dto.getSchoolId()));
        
        updateProfile(dto.getProfile(), model.getProfile()); // 更新档案信息
        return model;
    }

    // 更新Model
    private Student updateModel(final StudentDTO dto) {
        Student model = studentService.get(dto.getId());
        if (!model.getSchool().getId().equals(dto.getSchoolId())) {//变更学校
        	model.setSchool(this.schoolService.get(dto.getSchoolId()));
        }
        model.setName(dto.getName());
        model.setGrade(dto.getGrade());
        model.setGraduate(dto.isGraduate());
        
        updateProfile(dto.getProfile(), model.getProfile()); // 更新档案信息
        return model;
    }
    
    private StudentProfileDTO toProfileDTO(@NonNull final StudentProfile model) {
        final StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(model.getId());
        dto.setPrimarySchool(model.getPrimarySchool());
        dto.setMiddleSchool(model.getMiddleSchool());
        dto.setHighSchool(model.getHighSchool());
        dto.setUniversity(model.getUniversity());

        return dto;
    }
    
 // 更新Model
    private void updateProfile(final StudentProfileDTO dto, StudentProfile model) {
        model.setPrimarySchool(dto.getPrimarySchool());
        model.setMiddleSchool(dto.getMiddleSchool());
        model.setHighSchool(dto.getHighSchool());
        model.setUniversity(dto.getUniversity());
    }
}
