package sample.bizfuse.web.convertor.reimbursement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;
import sample.bizfuse.web.dto.reimbursement.TrafficReimburseDTO;
import sample.bizfuse.web.dto.reimbursement.TravelReimburseDTO;
import sample.bizfuse.web.model.reimbursement.TrafficReimburse;
import sample.bizfuse.web.model.reimbursement.TravelReimburse;
import sample.bizfuse.web.service.reimbursement.TravelReimburseService;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;

/**
 * TravelReimburseConvertor
 */
@Component
public class TravelReimburseConvertor extends AbstractConvertor<TravelReimburse, TravelReimburseDTO> {

    @Autowired
    private TravelReimburseService travelReimburseService;

    @Autowired
    private TrafficReimburseConvertor trafficReimburseConvertor;

    @Override
    public TravelReimburse toModel(@NonNull final TravelReimburseDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public TravelReimburseDTO toDTO(@NonNull final TravelReimburse model, final boolean forListView) {
        final TravelReimburseDTO dto = new TravelReimburseDTO();
        dto.setId(model.getId());
        dto.setDepId(model.getDepId());
        dto.setName(model.getName());
        dto.setReimburseTime(model.getReimburseTime());
        dto.setReason(model.getReason());
        dto.setProjectName(model.getProjectName());
        dto.setHotelExpense(model.getHotelExpense());
        dto.setTrafficSubsidyDays(model.getTrafficSubsidyDays());
        dto.setTrafficSubsidyNum(model.getTrafficSubsidyNum());
        dto.setFoodAllowanceDays(model.getFoodAllowanceDays());
        dto.setFoodAllowanceNum(model.getFoodAllowanceNum());
        dto.setOtherFee(model.getOtherFee());
        dto.setTrafficReimburse(trafficReimburseConvertor.toListDTO(model.getTrafficReimburse()));
        dto.setHeadOfUnit(model.getHeadOfUnit());
        dto.setPersonInCharge(model.getPersonInCharge());
        dto.setHeadOfResearchLaboratory(model.getHeadOfResearchLaboratory());

        return dto;
    }

    // 构建新Model
    private TravelReimburse constructModel(final TravelReimburseDTO dto) {
        TravelReimburse model = new TravelReimburse();
        model.setDepId(dto.getDepId());
        model.setName(dto.getName());
        model.setReimburseTime(dto.getReimburseTime());
        model.setReason(dto.getReason());
        model.setProjectName(dto.getProjectName());
        model.setHotelExpense(dto.getHotelExpense());
        model.setTrafficSubsidyDays(dto.getTrafficSubsidyDays());
        model.setTrafficSubsidyNum(dto.getTrafficSubsidyNum());
        model.setFoodAllowanceDays(dto.getFoodAllowanceDays());
        model.setFoodAllowanceNum(dto.getFoodAllowanceNum());
        model.setOtherFee(dto.getOtherFee());
        List<TrafficReimburseDTO> dtos =  dto.getTrafficReimburse();
        List<TrafficReimburse> models= new ArrayList<>();
        dtos.forEach(p->models.add(trafficReimburseConvertor.toModel(p)));
        model.setTrafficReimburse(models);
        model.setHeadOfUnit(dto.getHeadOfUnit());
        model.setPersonInCharge(dto.getPersonInCharge());
        model.setHeadOfResearchLaboratory(dto.getHeadOfResearchLaboratory());

        return model;
    }

    // 更新Model
    private TravelReimburse updateModel(final TravelReimburseDTO dto) {
        TravelReimburse model = travelReimburseService.get(dto.getId());
        model.setDepId(dto.getDepId());
        model.setName(dto.getName());
        model.setReimburseTime(dto.getReimburseTime());
        model.setReason(dto.getReason());
        model.setProjectName(dto.getProjectName());
        model.setHotelExpense(dto.getHotelExpense());
        model.setTrafficSubsidyDays(dto.getTrafficSubsidyDays());
        model.setTrafficSubsidyNum(dto.getTrafficSubsidyNum());
        model.setFoodAllowanceDays(dto.getFoodAllowanceDays());
        model.setFoodAllowanceNum(dto.getFoodAllowanceNum());
        model.setOtherFee(dto.getOtherFee());
        List<TrafficReimburseDTO> dtos =  dto.getTrafficReimburse();
        List<TrafficReimburse> models= new ArrayList<>();
        dtos.forEach(p->models.add(trafficReimburseConvertor.toModel(p)));
        model.setTrafficReimburse(models);
        model.setHeadOfUnit(dto.getHeadOfUnit());
        model.setPersonInCharge(dto.getPersonInCharge());
        model.setHeadOfResearchLaboratory(dto.getHeadOfResearchLaboratory());

        return model;
    }
}
