package sample.bizfuse.web.utils;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NumberUtil {

    public static void main(final String[] args) {
        System.out.println(NumberUtil.add(0.06, 0.00));
    }

    public static double add(final double v1, final double v2) {// 加法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.add(b2).doubleValue();
    }

    public static Long add(final Long v1, final Long v2) {// 加法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.add(b2).longValue();
    }

    public static double sub(final double v1, final double v2) {// 减法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.subtract(b2).doubleValue();
    }

    public static Long mul(final BigDecimal v1, final int v2) {// 乘法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.multiply(b2).longValue();
    }

    public static double mul(final double v1, final double v2) {// 乘法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.multiply(b2).doubleValue();
    }

    public static BigDecimal mul(final Long v1, final int v2) {// 乘法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.multiply(b2);
    }

    public static BigDecimal mul(final int v1, final int v2) {// 乘法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.multiply(b2);
    }

    public static double div(final double v1, final double v2) {// 除法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.divide(b2, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static BigDecimal div(final Long v1, final int v2) {// 除法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.divide(b2, 2, BigDecimal.ROUND_HALF_UP);
    }

    public static BigDecimal div(final int v1, final int v2) {// 除法
        final BigDecimal b1 = NumberUtil.numToDecimal(v1);
        final BigDecimal b2 = NumberUtil.numToDecimal(v2);
        return b1.divide(b2, 2, BigDecimal.ROUND_HALF_UP);
    }

    public static double round(final double v) {// 截取2位
        final BigDecimal b = NumberUtil.numToDecimal(v);
        final BigDecimal one = new BigDecimal("1");
        return b.divide(one, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static String decimalFormat(final String pattern, final double value) {
        return new DecimalFormat(pattern).format(value);
    }

    public static String decimalFormat(final double value) {
        return new DecimalFormat("0.00").format(value);
    }

    public static String decimalFormat(final double value, final String pattern) {
        return new DecimalFormat(pattern).format(value);
    }

    public static String decimalBlankFormat(final double value) {
        return new DecimalFormat("0").format(value);
    }

    public static boolean isNumber(final String value) { // 检查是否是数字
        final String patternStr = "^\\d+$";
        final Pattern p = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE); // 忽略大小写;
        final Matcher m = p.matcher(value);
        return m.find();
    }

    /**
     * 转换数字类型为BigDecimal
     *
     * @param obj
     * @return
     */
    public static BigDecimal numToDecimal(final Object obj) {
        BigDecimal bigDecimal = new BigDecimal(0);
        if (obj == null) {
            return bigDecimal;
        }
        if (obj instanceof Integer) {
            bigDecimal = new BigDecimal((Integer) obj);
        } else if (obj instanceof Long) {
            bigDecimal = new BigDecimal((Long) obj);
        } else if (obj instanceof Short) {
            bigDecimal = new BigDecimal((Short) obj);
        } else if (obj instanceof Byte) {
            bigDecimal = new BigDecimal((Byte) obj);
        } else if (obj instanceof Double) {
            bigDecimal = new BigDecimal((Double) obj);
        } else if (obj instanceof Float) {
            bigDecimal = new BigDecimal((Float) obj);
        } else if (obj instanceof BigDecimal) {
            bigDecimal = (BigDecimal) obj;
        }
        return bigDecimal;
    }

    public static int randomTest(final int max, final int min) {
        final Random random = new Random();
        final int s = (random.nextInt(max) % ((max - min) + 1)) + min;
        return s;
    }
}
