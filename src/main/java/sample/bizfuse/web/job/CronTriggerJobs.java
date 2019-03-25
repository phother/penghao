package sample.bizfuse.web.job;

import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.quartz.core.annotition.CronTrigger;
import com.leadingsoft.bizfuse.quartz.core.annotition.Job;
import com.leadingsoft.bizfuse.quartz.core.annotition.JobMapping;

/**
 * 支持Cron表达式的定时任务Demo
 * <p>
 * Here are some full examples: <br><table cellspacing="8">
 * <tr>
 * <th align="left">Expression</th>
 * <th align="left">&nbsp;</th>
 * <th align="left">Meaning</th>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 0 12 * * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 12pm (noon) every day</code></td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 ? * *"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am every day</code></td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 * * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am every day</code></td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 * * ? *"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am every day</code></td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 * * ? 2005"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am every day during the year 2005</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 * 14 * * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire every minute starting at 2pm and ending at 2:59pm, every day</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 0/5 14 * * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire every 5 minutes starting at 2pm and ending at 2:55pm, every day</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 0/5 14,18 * * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire every 5 minutes starting at 2pm and ending at 2:55pm, AND fire every 5 minutes starting at 6pm and ending at 6:55pm, every day</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 0-5 14 * * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire every minute starting at 2pm and ending at 2:05pm, every day</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 10,44 14 ? 3 WED"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 2:10pm and at 2:44pm every Wednesday in the month of March.</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 ? * MON-FRI"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am every Monday, Tuesday, Wednesday, Thursday and Friday</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 15 * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am on the 15th day of every month</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 L * ?"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am on the last day of every month</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 ? * 6L"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am on the last Friday of every month</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 ? * 6L"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am on the last Friday of every month</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 ? * 6L 2002-2005"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am on every last Friday of every month during the years 2002, 2003, 2004 and 2005</code>
 * </td>
 * </tr>
 * <tr>
 * <td align="left"><code>"0 15 10 ? * 6#3"</code></td>
 * <td align="left">&nbsp;</th>
 * <td align="left"><code>Fire at 10:15am on the third Friday of every month</code>
 * </td>
 * </tr>
 * </table>
 * </p>
 */
@Job
@Component
public class CronTriggerJobs {

	@JobMapping(id="CronTriggerJobs.task01", allowConcurrent=false)
	@CronTrigger(cronExpression="0 0/5 * * * ?") // Fire every 5 minutes every day
	public void task01() {
		System.out.println("触发定时任务 CronTriggerJobs.task01");
	}
}
