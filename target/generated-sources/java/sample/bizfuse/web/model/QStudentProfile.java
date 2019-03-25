package sample.bizfuse.web.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QStudentProfile is a Querydsl query type for StudentProfile
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStudentProfile extends EntityPathBase<StudentProfile> {

    private static final long serialVersionUID = -1514252213L;

    public static final QStudentProfile studentProfile = new QStudentProfile("studentProfile");

    public final com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel _super = new com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel(this);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.util.Date> createdDate = _super.createdDate;

    public final StringPath highSchool = createString("highSchool");

    //inherited
    public final NumberPath<Long> id = _super.id;

    //inherited
    public final StringPath lastModifiedBy = _super.lastModifiedBy;

    //inherited
    public final DateTimePath<java.util.Date> lastModifiedDate = _super.lastModifiedDate;

    public final StringPath middleSchool = createString("middleSchool");

    public final StringPath primarySchool = createString("primarySchool");

    public final StringPath university = createString("university");

    //inherited
    public final NumberPath<Long> version = _super.version;

    public QStudentProfile(String variable) {
        super(StudentProfile.class, forVariable(variable));
    }

    public QStudentProfile(Path<? extends StudentProfile> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStudentProfile(PathMetadata metadata) {
        super(StudentProfile.class, metadata);
    }

}

