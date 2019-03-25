package sample.bizfuse.web.config.quartz;

import org.springframework.context.annotation.Configuration;

import com.leadingsoft.bizfuse.quartz.core.annotition.EnableBizfuseQuartzScheduling;

/**
 * JOB框架Quartz配置
 */
@Configuration
@EnableBizfuseQuartzScheduling
public class SchedulingConfiguration {
}
