package sample.bizfuse.web.enums;

/**
 * 交通工具
 */

public enum Subject {
	officeExpenses("办公费"), //办公费
	printingCost("印刷费"),//印刷费
	serviceCharge("手续费"), //手续费
	conferenceFee("会议费"), //会议费
	trainingFee("培训费"), //培训费
	postCharges("邮电费"),//邮电费
	overtimeMeals("加班餐费"), //加班餐费
	powerCosts("燃料动力费"),//燃料动力费
	equipmentAcquisitionFee("设备购置费"), //设备购置费
	maintenanceCost("维修(护)费"), //维修（护）费
	rentalFee("租赁费"), //租赁费
	specialMaterialFee("专用材料费"),//专用材料费
	otherTransportationCharges("其他交通费"), //其他交通费
	chargeForWater("水费"),//水费
	electricityFees("电费"), //电费
	propertyManagementFee("物业管理费"), //物业管理费
	other("其他支出"),//其他支出
	unknown("");

	private String value;

	private Subject(final String value) {
		this.value = value;
	}

	public static Subject getCodeType(final String value) {
		for (final Subject type : Subject.values()) {
			if (type.getValue().equals(value)) {
				return type;
			}
		}
		return Subject.unknown;
	}

	public String getValue() {
		return this.value;
	}

}
