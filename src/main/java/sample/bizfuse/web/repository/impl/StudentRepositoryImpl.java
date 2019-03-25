package sample.bizfuse.web.repository.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.jpa.repository.AbstractRepository;
import com.leadingsoft.bizfuse.common.web.support.Searchable;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;

import sample.bizfuse.web.bean.SchoolStudentCountBean;
import sample.bizfuse.web.enums.TeacherLevel;
import sample.bizfuse.web.model.QSchool;
import sample.bizfuse.web.model.QStudent;
import sample.bizfuse.web.model.Student;
import sample.bizfuse.web.repository.StudentRepositoryCustom;

/**
 * 基于QueryDSL框架的 学生的自定义查询接口实现
 * <p>
 * QueryDSL详细文档
 * <code>http://www.querydsl.com/static/querydsl/4.1.3/reference/html_single/</code>
 * <code>http://git.leadingsoft.com.cn/ldp/bizfuse2-0/wikis/Bizfuse3JpaQueryDSL</code>
 */
@Component
public class StudentRepositoryImpl extends AbstractRepository implements StudentRepositoryCustom {

	/*
	 * 常用分页、排序 + 条件过滤 场景举例： </br>
	 * 1. 分页、排序信息都封装在 Pageable中  </br>
	 * 2. 条件信息封装在 Searchable中 </br>
	 */
	@Override
	public Page<Student> searchPage(Pageable pageable, Searchable searchable) {
		QStudent qStudent = QStudent.student;
		BooleanBuilder where = new BooleanBuilder();

		/**
		 * 父类为Searchable提供了很多辅助方法，帮助简化逻辑，比如： </br>
		 * containsStr 用于模糊查询字符串，相当于 LIKE ‘%value%’ </br>
		 * equalsInt、equalsLong、equalsStr 等方法为了匹配值，相当于 = value </br>
		 */
		// 模糊查询
		where.and(containsStr(qStudent.name, searchable, "name"))
				// 精确匹配
				.and(equalsInt(qStudent.grade, searchable, "grade"))
				// @ManyToOne 级联查询
				.and(equalsLong(qStudent.school.id, searchable, "schoolId"))
				// @ManyToMany 级联查询
				.and(equalsLong(qStudent.teachers.any().id, searchable, "teacherId"))
				// 枚举类型的过滤
				.and(equalsEnum(qStudent.teachers.any().level, searchable, "teacherLevel", TeacherLevel::valueOf));

		// 条件 + 分页 查询
		return search(where, pageable, qStudent);
	}

	/*
	 * 统计类查询举例 </bar>
	 * 1. 返回普通Bean的特殊查询 </br>
	 * 2. 支持 Group By 的查询 </br>
	 */
	@Override
	public Page<SchoolStudentCountBean> countBySchool(Pageable pageable) {
		QStudent qStudent = QStudent.student;
		QSchool qSchool = qStudent.school;

		JPAQuery<SchoolStudentCountBean> query = this.query()
				.select(Projections.bean(SchoolStudentCountBean.class, qSchool.id.as("schoolId"),
						qSchool.name.as("schoolName"), qStudent.id.count().as("studentCount")))
				.from(qStudent).groupBy(qStudent.school);

		return this.search(query, pageable);
	}

	/*
	 * 子查询举例: JPAExpressions 工具类支持子查询
	 */
	@Override
	public List<Student> searchHighestGrade() {
		QStudent qStudent = QStudent.student;
		QStudent qSub = QStudent.student;
		
		return this.query()
		.selectFrom(qStudent)
		.where(qStudent.grade.eq(
				JPAExpressions.select(qSub.grade.max()).from(qSub)))
		.fetch();
	}

	@Override
	protected Class<?> getModelClass() {
		return Student.class;
	}

}
