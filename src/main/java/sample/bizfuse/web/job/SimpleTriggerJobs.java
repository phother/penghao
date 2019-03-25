package sample.bizfuse.web.job;

import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.quartz.core.annotition.Job;
import com.leadingsoft.bizfuse.quartz.core.annotition.JobMapping;
import com.leadingsoft.bizfuse.quartz.core.annotition.SimpleTrigger;

/**
 * 简单的定时任务Demo
 */
@Job
@Component
public class SimpleTriggerJobs {

	@JobMapping(id="SimpleTriggerJobs.task01", allowConcurrent=false)
	@SimpleTrigger(repeatInterval=60000, repeatCount=10) // 每60秒执行一次，重复10次
	public void task01() {
		System.out.println("触发定时任务 SimpleTriggerJobs.task01");
	}
}
