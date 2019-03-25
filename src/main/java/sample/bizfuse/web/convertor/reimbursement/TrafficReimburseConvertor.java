package sample.bizfuse.web.convertor.reimbursement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.common.web.dto.AbstractConvertor;
import sample.bizfuse.web.dto.reimbursement.TrafficReimburseDTO;
import sample.bizfuse.web.model.reimbursement.TrafficReimburse;
import sample.bizfuse.web.service.reimbursement.TrafficReimburseService;
import lombok.NonNull;

/**
 * TrafficReimburseConvertor
 */
@Component
public class TrafficReimburseConvertor extends AbstractConvertor<TrafficReimburse, TrafficReimburseDTO> {

    @Autowired
    private TrafficReimburseService trafficReimburseService;
    
    @Override
    public TrafficReimburse toModel(@NonNull final TrafficReimburseDTO dto) {
        if (dto.isNew()) {//新增
            return constructModel(dto);
        } else {//更新
            return updateModel(dto);
        }
    }

    @Override
    public TrafficReimburseDTO toDTO(@NonNull final TrafficReimburse model, final boolean forListView) {
        final TrafficReimburseDTO dto = new TrafficReimburseDTO();
        dto.setId(model.getId());
        dto.setTrafficTime(model.getTrafficTime());
        dto.setSource(model.getSource());
        dto.setDestination(model.getDestination());
        dto.setVehicle(model.getVehicle());
        dto.setLevel(model.getLevel());
        dto.setTrafficeFee(model.getTrafficeFee());

        return dto;
    }

    // 构建新Model
    private TrafficReimburse constructModel(final TrafficReimburseDTO dto) {
        TrafficReimburse model = new TrafficReimburse();
        model.setTrafficTime(dto.getTrafficTime());
        model.setSource(dto.getSource());
        model.setDestination(dto.getDestination());
        model.setVehicle(dto.getVehicle());
        model.setLevel(dto.getLevel());
        model.setTrafficeFee(dto.getTrafficeFee());

        return model;
    }

    // 更新Model
    private TrafficReimburse updateModel(final TrafficReimburseDTO dto) {
        TrafficReimburse model = trafficReimburseService.get(dto.getId());
        model.setTrafficTime(dto.getTrafficTime());
        model.setSource(dto.getSource());
        model.setDestination(dto.getDestination());
        model.setVehicle(dto.getVehicle());
        model.setLevel(dto.getLevel());
        model.setTrafficeFee(dto.getTrafficeFee());

        return model;
    }
}
