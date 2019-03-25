package sample.bizfuse.web.enums;

/**
 * 交通工具
 */

public enum Vehicle {
	plane("飞机"), //飞机
	train("火车"),//火车
	car("长途汽车"), //客车
	taxi("出租车"), //营业
	bus("环科院公车"), //停业
	other("其他"),//其他
	unknown("");

	private String value;

	private Vehicle(final String value) {
		this.value = value;
	}

	public static Vehicle getCodeType(final String value) {
		for (final Vehicle type : Vehicle.values()) {
			if (type.getValue().equals(value)) {
				return type;
			}
		}
		return Vehicle.unknown;
	}

	public String getValue() {
		return this.value;
	}

}
