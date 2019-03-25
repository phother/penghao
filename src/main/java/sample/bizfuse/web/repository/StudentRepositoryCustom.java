package sample.bizfuse.web.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.leadingsoft.bizfuse.common.web.support.Searchable;

import sample.bizfuse.web.bean.SchoolStudentCountBean;
import sample.bizfuse.web.model.Student;

/**
 * 学生的自定义查询接口
 * <p>
 * JPA无法满足的动态条件查询、统计等复杂查询，统一采用自定义接口+实现类方式扩展
 */
public interface StudentRepositoryCustom {

	/**
	 * 按检索条件动态过滤的分页查询 （最常用分页、排序 + 过滤 场景举例）
	 *
	 * @param pageable 分页信息
	 * @param searchable 查询条件
	 * @return 查询结果
	 */
	Page<Student> searchPage(Pageable pageable, Searchable searchable);
	
	/**
	 * 统计每个学校的学生数量 （Group By + 自定义Bean返回类型 场景举例）
	 * @param pageable 分页信息
	 * @return
	 */
	Page<SchoolStudentCountBean> countBySchool(Pageable pageable);
	
	/**
	 * 查找最高年级的所有学生 （子查询 场景举例）
	 * @return
	 */
	List<Student> searchHighestGrade();
}
