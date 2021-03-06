package sample.bizfuse.web.service.reimbursement;

import sample.bizfuse.web.model.reimbursement.TrafficReimburse;

/**
 * TrafficReimburseService
 */
public interface TrafficReimburseService {

    /**
     * 根据ID获取资源
     *
     * @param id 资源实例ID
     * @return Id所指向的资源实例
     * @throws 当Id所指向的资源不存在时，抛CustomRuntimeException异常
     */
    TrafficReimburse get(Long id);

    /**
     * 创建
     *
     * @param model 资源实例
     * @return 创建后的对象
     */
    TrafficReimburse create(TrafficReimburse model);

    /**
     * 更新
     *
     * @param model 编辑后的资源实例
     * @return 修改后的对象
     */
    TrafficReimburse update(TrafficReimburse model);
    
    /**
     * 删除
     *
     * @param id 资源实例ID
     */
    void delete(Long id);

}
