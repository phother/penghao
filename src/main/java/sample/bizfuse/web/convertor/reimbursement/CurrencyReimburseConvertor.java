package sample.bizfuse.web.convertor.reimbursement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;
import sample.bizfuse.web.dto.reimbursement.CurrencyReimburseDTO;
import sample.bizfuse.web.model.reimbursement.CurrencyReimburse;
import sample.bizfuse.web.service.reimbursement.CurrencyReimburseService;
import lombok.NonNull;

/**
 * CurrencyReimburseConvertor
 */
@Component
public class CurrencyReimburseConvertor extends AbstractConvertor<CurrencyReimburse, CurrencyReimburseDTO> {

    @Autowired
    private CurrencyReimburseService currencyReimburseService;
    
    @Override
    public CurrencyReimburse toModel(@NonNull final CurrencyReimburseDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public CurrencyReimburseDTO toDTO(@NonNull final CurrencyReimburse model, final boolean forListView) {
        final CurrencyReimburseDTO dto = new CurrencyReimburseDTO();
        dto.setId(model.getId());
        dto.setDepId(model.getDepId());
        dto.setName(model.getName());
        dto.setReimburseTime(model.getReimburseTime());
        dto.setDetails(model.getDetails());
        dto.setSumReimburse(model.getSumReimburse());
        dto.setMark(model.getMark());
        dto.setInvoiceCount(model.getInvoiceCount());
        dto.setHeadOfUnit(model.getHeadOfUnit());
        dto.setPersonInCharge(model.getPersonInCharge());
        dto.setHeadOfResearchLaboratory(model.getHeadOfResearchLaboratory());

        return dto;
    }

    // 构建新Model
    private CurrencyReimburse constructModel(final CurrencyReimburseDTO dto) {
        CurrencyReimburse model = new CurrencyReimburse();
        model.setDepId(dto.getDepId());
        model.setName(dto.getName());
        model.setReimburseTime(dto.getReimburseTime());
        model.setDetails(dto.getDetails());
        model.setSumReimburse(dto.getSumReimburse());
        model.setMark(dto.getMark());
        model.setInvoiceCount(dto.getInvoiceCount());
        model.setHeadOfUnit(dto.getHeadOfUnit());
        model.setPersonInCharge(dto.getPersonInCharge());
        model.setHeadOfResearchLaboratory(dto.getHeadOfResearchLaboratory());

        return model;
    }

    // 更新Model
    private CurrencyReimburse updateModel(final CurrencyReimburseDTO dto) {
        CurrencyReimburse model = currencyReimburseService.get(dto.getId());
        model.setDepId(dto.getDepId());
        model.setName(dto.getName());
        model.setReimburseTime(dto.getReimburseTime());
        model.setDetails(dto.getDetails());
        model.setSumReimburse(dto.getSumReimburse());
        model.setMark(dto.getMark());
        model.setInvoiceCount(dto.getInvoiceCount());
        model.setHeadOfUnit(dto.getHeadOfUnit());
        model.setPersonInCharge(dto.getPersonInCharge());
        model.setHeadOfResearchLaboratory(dto.getHeadOfResearchLaboratory());

        return model;
    }
}
