package sample.bizfuse.web.enums;

/**
 * Created by PH on 2019/3/25.
 */
public enum TrafficLevel {

    business_seat ("商务座"),//商务座
    first_seat ("一等座"),//一等座
    second_seat("二等座"), //二等座
    business_class("公务舱"), //商务舱
    economy_class("经济舱"), //经济舱
    other("其它"),//其它
    unknown("");

    private String value;

    private TrafficLevel(final String value) {
        this.value = value;
    }

    public static TrafficLevel getCodeType(final String value) {
        for (final TrafficLevel type : TrafficLevel.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        return TrafficLevel.unknown;
    }

    public String getValue() {
        return this.value;
    }
}
