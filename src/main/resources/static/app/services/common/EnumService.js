/**
 * 基础（枚举）数据存储服务
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp").service("EnumService", function () {
    this._data = {
        /*性别*/
        "genderType": [
            {"key": "male", "text": "男"},
            {"key": "female", "text": "女"}
        ],
        "Subject": [
            {"key": "officeExpenses", "text": "办公费"},
            {"key": "printingCost", "text": "印刷费"},
            {"key": "serviceCharge", "text": "手续费"},
            {"key": "conferenceFee", "text": "会议费"},
            {"key": "trainingFee", "text": "培训费"},
            {"key": "postCharges", "text": "邮电费"},
            {"key": "overtimeMeals", "text": "加班餐费"},
            {"key": "powerCosts", "text": "燃料动力费"},
            {"key": "equipmentAcquisitionFee", "text": "设备购置费"},
            {"key": "maintenanceCost", "text": "维修(护)费"},
            {"key": "rentalFee", "text": "租赁费"},
            {"key": "specialMaterialFee", "text": "专用材料费"},
            {"key": "otherTransportationCharges", "text": "其他交通费"},
            {"key": "chargeForWater", "text": "水费"},
            {"key": "electricityFees", "text": "electricityFees"},
            {"key": "propertyManagementFee", "text": "物业管理费"},
            {"key": "other", "text": "其他支出"}
        ]
    };
    this.get = function (key) {
        return this._data[key];
    }
});