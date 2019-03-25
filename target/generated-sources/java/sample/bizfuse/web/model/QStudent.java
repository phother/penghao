package sample.bizfuse.web.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStudent is a Querydsl query type for Student
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStudent extends EntityPathBase<Student> {

    private static final long serialVersionUID = 1152384894L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStudent student = new QStudent("student");

    public final com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel _super = new com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel(this);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.util.Date> createdDate = _super.createdDate;

    public final NumberPath<Integer> grade = createNumber("grade", Integer.class);

    public final BooleanPath graduate = createBoolean("graduate");

    //inherited
    public final NumberPath<Long> id = _super.id;

    //inherited
    public final StringPath lastModifiedBy = _super.lastModifiedBy;

    //inherited
    public final DateTimePath<java.util.Date> lastModifiedDate = _super.lastModifiedDate;

    public final StringPath name = createString("name");

    public final QStudentProfile profile;

    public final QSchool school;

    public final ListPath<Teacher, QTeacher> teachers = this.<Teacher, QTeacher>createList("teachers", Teacher.class, QTeacher.class, PathInits.DIRECT2);

    //inherited
    public final NumberPath<Long> version = _super.version;

    public QStudent(String variable) {
        this(Student.class, forVariable(variable), INITS);
    }

    public QStudent(Path<? extends Student> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStudent(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStudent(PathMetadata metadata, PathInits inits) {
        this(Student.class, metadata, inits);
    }

    public QStudent(Class<? extends Student> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.profile = inits.isInitialized("profile") ? new QStudentProfile(forProperty("profile")) : null;
        this.school = inits.isInitialized("school") ? new QSchool(forProperty("school")) : null;
    }

}

