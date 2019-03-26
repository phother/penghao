package sample.bizfuse.web.utils;


import com.leadingsoft.bizfuse.common.web.exception.CustomRuntimeException;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.time.*;
import java.time.chrono.ChronoZonedDateTime;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间处理工具类
 *
 * @author Administrator
 */
public class DateUtils {

    private static final ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<SimpleDateFormat>();

    private static final Object object = new Object();

    /**
     * 获取SimpleDateFormat
     *
     * @param pattern 日期格式
     * @return SimpleDateFormat对象
     * @throws RuntimeException 异常：非法日期格式
     */
    private static SimpleDateFormat getDateFormat(final String pattern) throws RuntimeException {
        SimpleDateFormat dateFormat = DateUtils.threadLocal.get();
        if (dateFormat == null) {
            synchronized (DateUtils.object) {

                    dateFormat = new SimpleDateFormat(pattern);
                    dateFormat.setLenient(false);
                    DateUtils.threadLocal.set(dateFormat);

            }
        }
        dateFormat.applyPattern(pattern);
        return dateFormat;
    }

    /**
     * 将日期字符串转化为日期。失败返回null。
     *
     * @param date 日期字符串
     * @param pattern 日期格式
     * @return 日期
     */
    public static Date StringToDate(final String date, final String pattern) {
        Date myDate = null;
        if ((date != null) && StringUtils.hasText(date) && !"".equals(date)) {
            try {
                myDate = DateUtils.getDateFormat(pattern).parse(date);
            } catch (final Exception e) {
                throw new CustomRuntimeException("1", String.format("时间字符串格式无法转换为时间格式."));
            }
        }
        return myDate;
    }

    /**
     * 将日期字符串转化为日期。失败返回null。
     *
     * @param date 日期字符串
     * @param dateStyle 日期风格
     * @return 日期
     */
    public static Date StringToDate(final String date, final DateStyle dateStyle) {
        Date myDate = null;
        if (dateStyle != null) {
            myDate = DateUtils.StringToDate(date, dateStyle.getValue());
        }
        return myDate;
    }

    /**
     * 将日期转化为日期字符串。失败返回null。
     *
     * @param date 日期
     * @param pattern 日期格式
     * @return 日期字符串
     */
    public static String DateToString(final Date date, final String pattern) {
        String dateString = null;
        if (date != null) {
            try {
                dateString = DateUtils.getDateFormat(pattern).format(date);
            } catch (final Exception e) {
                throw new CustomRuntimeException("1", String.format("时间格式无法转换为字符串格式."));
            }
        }
        return dateString;
    }

    /**
     * 将日期转化为日期字符串。失败返回null。
     *
     * @param date 日期
     * @param dateStyle 日期风格
     * @return 日期字符串
     */
    public static String DateToString(final Date date, final DateStyle dateStyle) {
        String dateString = null;
        if ((date != null) && (dateStyle != null)) {
            dateString = DateUtils.DateToString(date, dateStyle.getValue());
        }
        return dateString;
    }

    /**
     * 将日期转化为日期字符串。失败返回""。
     *
     * @param date 日期
     * @param dateStyle 日期风格
     * @return 日期字符串
     */
    public static String DateToNotNullString(final Date date, final DateStyle dateStyle) {
        String dateString = "";
        if ((date != null) && (dateStyle != null)) {
            dateString = DateUtils.DateToString(date, dateStyle.getValue());
        }
        return dateString;
    }

    /**
     * 当前时间增加一个小时
     *
     * @param date
     * @param n
     * @return
     */
    public static Date addHours(final Date date, final int n) {
        try {
            final Calendar cd = Calendar.getInstance();
            cd.setTime(date);
            cd.add(Calendar.HOUR_OF_DAY, n);//增加n个小时
            return cd.getTime();

        } catch (final Exception e) {
            return null;
        }

    }

    /**
     * 当前时间增加一天
     *
     * @param date
     * @param n
     * @return
     */
    public static Date addDays(final Date date, final int n) {
        try {
            final Calendar cd = Calendar.getInstance();
            cd.setTime(date);
            cd.add(Calendar.DATE, n);
            return cd.getTime();

        } catch (final Exception e) {
            return null;
        }

    }

    /**
     *>=  时间比较
     *
     * @param datef
     * @param dates
     * @return
     */
    public static boolean afterAndEqual(Date datef,Date dates){

        if(datef.getTime()>= dates.getTime()){
            return true;
        }
        return false;
    }
    
    /**
     *  Date->LocalDateTime   转换
     *
     * @param date
     * @return
     */
    public static LocalDateTime date2LocalDateTime(Date date){
    	
    	Instant instant = date.toInstant();
    	ZoneId zoneId = ZoneId.systemDefault();
    	
    	LocalDateTime localDateTime = instant.atZone(zoneId).toLocalDateTime();
    	
    	return localDateTime;
    }
    
    
    /**
     *  LocalDateTime->Date   转换
     *
     * @param date
     * @return
     */
    public static Date LocalDateTime2Date(LocalDateTime localDateTime){
    	
    	ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime zdt = localDateTime.atZone(zoneId);
        Date date = Date.from(zdt.toInstant());
    	
    	return date;
    }
    
    /**
     *  Date->LocalDate   转换
     *
     * @param date
     * @return
     */
    public static LocalDate date2LocalDate(Date date){
    	
    	Instant  instant = date.toInstant();
        ZoneId zoneId  = ZoneId.systemDefault();
        return instant.atZone(zoneId).toLocalDate();
    }
    
    
    /**
     *  LocalDate->Date   转换
     *
     * @param date
     * @return
     */
    public static Date LocalDate2Date(LocalDate localDate){
    	 ZoneId zoneId = ZoneId.systemDefault();
         ChronoZonedDateTime<LocalDate> zonedDateTime = localDate.atStartOfDay(zoneId);
         return Date.from(zonedDateTime.toInstant());
    	
    }
    

}
