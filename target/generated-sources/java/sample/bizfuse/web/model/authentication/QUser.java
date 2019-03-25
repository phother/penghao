package sample.bizfuse.web.model.authentication;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = -1671402876L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUser user = new QUser("user");

    public final com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel _super = new com.leadingsoft.bizfuse.common.jpa.model.QAbstractAuditModel(this);

    public final BooleanPath accountExpired = createBoolean("accountExpired");

    public final BooleanPath accountLocked = createBoolean("accountLocked");

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.util.Date> createdDate = _super.createdDate;

    public final BooleanPath credentialsExpired = createBoolean("credentialsExpired");

    public final QUserDetails details;

    public final StringPath email = createString("email");

    public final BooleanPath enabled = createBoolean("enabled");

    //inherited
    public final NumberPath<Long> id = _super.id;

    //inherited
    public final StringPath lastModifiedBy = _super.lastModifiedBy;

    //inherited
    public final DateTimePath<java.util.Date> lastModifiedDate = _super.lastModifiedDate;

    public final StringPath loginId = createString("loginId");

    public final StringPath mobile = createString("mobile");

    public final StringPath no = createString("no");

    public final StringPath password = createString("password");

    //inherited
    public final NumberPath<Long> version = _super.version;

    public QUser(String variable) {
        this(User.class, forVariable(variable), INITS);
    }

    public QUser(Path<? extends User> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUser(PathMetadata metadata, PathInits inits) {
        this(User.class, metadata, inits);
    }

    public QUser(Class<? extends User> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.details = inits.isInitialized("details") ? new QUserDetails(forProperty("details")) : null;
    }

}

