package sample.bizfuse.web.model.authentication;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUserDetails is a Querydsl query type for UserDetails
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUserDetails extends EntityPathBase<UserDetails> {

    private static final long serialVersionUID = 1147208478L;

    public static final QUserDetails userDetails = new QUserDetails("userDetails");

    public final com.leadingsoft.bizfuse.common.jpa.model.QAbstractModel _super = new com.leadingsoft.bizfuse.common.jpa.model.QAbstractModel(this);

    public final StringPath address = createString("address");

    public final DateTimePath<java.util.Date> birthday = createDateTime("birthday", java.util.Date.class);

    public final StringPath city = createString("city");

    public final StringPath country = createString("country");

    public final StringPath district = createString("district");

    public final EnumPath<sample.bizfuse.web.enums.Gender> gender = createEnum("gender", sample.bizfuse.web.enums.Gender.class);

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final StringPath name = createString("name");

    public final StringPath nickname = createString("nickname");

    public final StringPath province = createString("province");

    public QUserDetails(String variable) {
        super(UserDetails.class, forVariable(variable));
    }

    public QUserDetails(Path<? extends UserDetails> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUserDetails(PathMetadata metadata) {
        super(UserDetails.class, metadata);
    }

}

