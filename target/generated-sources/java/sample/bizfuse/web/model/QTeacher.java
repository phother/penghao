package sample.bizfuse.web.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QTeacher is a Querydsl query type for Teacher
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QTeacher extends EntityPathBase<Teacher> {

    private static final long serialVersionUID = 1591953701L;

    public static final QTeacher teacher = new QTeacher("teacher");

    public final com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel _super = new com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel(this);

    public final NumberPath<Integer> age = createNumber("age", Integer.class);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.util.Date> createdDate = _super.createdDate;

    //inherited
    public final NumberPath<Long> id = _super.id;

    //inherited
    public final StringPath lastModifiedBy = _super.lastModifiedBy;

    //inherited
    public final DateTimePath<java.util.Date> lastModifiedDate = _super.lastModifiedDate;

    public final EnumPath<sample.bizfuse.web.enums.TeacherLevel> level = createEnum("level", sample.bizfuse.web.enums.TeacherLevel.class);

    public final StringPath name = createString("name");

    public final NumberPath<Integer> teachingAge = createNumber("teachingAge", Integer.class);

    //inherited
    public final NumberPath<Long> version = _super.version;

    public QTeacher(String variable) {
        super(Teacher.class, forVariable(variable));
    }

    public QTeacher(Path<? extends Teacher> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTeacher(PathMetadata metadata) {
        super(Teacher.class, metadata);
    }

}

