package sample.bizfuse.web.convertor.reimbursement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;
import sample.bizfuse.web.dto.reimbursement.ReimburseDetailDTO;
import sample.bizfuse.web.enums.Subject;
import sample.bizfuse.web.model.reimbursement.ReimburseDetail;
import sample.bizfuse.web.service.reimbursement.ReimburseDetailService;
import lombok.NonNull;

/**
 * ReimburseDetailConvertor
 */
@Component
public class ReimburseDetailConvertor extends AbstractConvertor<ReimburseDetail, ReimburseDetailDTO> {

    @Autowired
    private ReimburseDetailService reimburseDetailService;
    
    @Override
    public ReimburseDetail toModel(@NonNull final ReimburseDetailDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public ReimburseDetailDTO toDTO(@NonNull final ReimburseDetail model, final boolean forListView) {
        final ReimburseDetailDTO dto = new ReimburseDetailDTO();
        dto.setId(model.getId());
        dto.setRemark(model.getRemark());
        dto.setSubId(model.getSubId().name());
        dto.setRemiburseMoney(model.getRemiburseMoney());

        return dto;
    }

    // 构建新Model
    private ReimburseDetail constructModel(final ReimburseDetailDTO dto) {
        ReimburseDetail model = new ReimburseDetail();
        model.setRemark(dto.getRemark());
        model.setSubId(Subject.valueOf(dto.getSubId()));
        model.setRemiburseMoney(dto.getRemiburseMoney());

        return model;
    }

    // 更新Model
    private ReimburseDetail updateModel(final ReimburseDetailDTO dto) {
        ReimburseDetail model = reimburseDetailService.get(dto.getId());
        model.setRemark(dto.getRemark());
        model.setSubId(Subject.valueOf(dto.getSubId()));
        model.setRemiburseMoney(dto.getRemiburseMoney());

        return model;
    }
}
