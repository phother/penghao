package sample.bizfuse.web.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Created by PH on 2019/3/25.
 */
public class UpperChineseUtils {
    private static final char[] CN_UPPER_NUMBER = "零壹贰叁肆伍陆柒捌玖".toCharArray();
    private static final char[] CN_UPPER_UNIT = "仟佰拾".toCharArray();
    private static final char[] CN_GROUP = "圆万亿".toCharArray();

    public static String moneyToChinese(BigDecimal i_money) {
        if(i_money.equals(BigDecimal.ZERO)){
            return "零圆整";
        }
        if (i_money.doubleValue() >= 100000000 || i_money.doubleValue() < 0.01) {
            return "";
        }
        i_money = i_money.setScale(2, RoundingMode.HALF_UP);
        String numStr = i_money.toString();
        int pointPos = numStr.indexOf('.');
        String s_int = null; //整数部分
        String s_point = null; //小数部分
        if (pointPos >= 0) {
            s_int = numStr.substring(0, pointPos);
            s_point = numStr.substring(pointPos + 1);
        } else {
            s_int = numStr;
        }
        StringBuilder sb = new StringBuilder();
        if(!"0".equals(s_int)){
            int groupCount = (int) Math.ceil(s_int.length() / 4.0);
            for (int group = 0; group < groupCount; group++) {
                boolean zeroFlag = true;
                boolean noZeroFlag = false;
                int start = (s_int.length() % 4 == 0 ? 0 : (s_int.length() % 4 - 4)) + 4 * group;
                for (int i = 0; i < 4; i++) {
                    if (i + start >= 0) {
                        int value = s_int.charAt(i + start) - '0';
                        if (value > 0) {
                            sb.append(CN_UPPER_NUMBER[value]);
                            if (i < 3) {
                                sb.append(CN_UPPER_UNIT[i]);
                            }
                            zeroFlag = true;
                            noZeroFlag = true;
                        } else if (zeroFlag) {
                            sb.append('零');
                            zeroFlag = false;
                        }
                    }
                }
                if(sb.charAt(sb.length() - 1) == '零'){
                    sb.deleteCharAt(sb.length() - 1);
                }
                if(noZeroFlag || groupCount - group == 1){
                    sb.append(CN_GROUP[groupCount - group - 1]);
                }
            }
        }
        if (s_point == null || "00".equals(s_point)) {
            sb.append('整');
        }else{
            int j = s_point.charAt(0) - '0';
            int f = s_point.charAt(1) - '0';
            if(j > 0){
                sb.append(CN_UPPER_NUMBER[j]).append('角');
                if(f != 0){
                    sb.append(CN_UPPER_NUMBER[f]).append('分');
                }
            }else if("0".equals(s_int)){
                sb.append(CN_UPPER_NUMBER[f]).append('分');
            }else {
                sb.append('零').append(CN_UPPER_NUMBER[f]).append('分');
            }
        }
        return sb.toString();
    }
}
