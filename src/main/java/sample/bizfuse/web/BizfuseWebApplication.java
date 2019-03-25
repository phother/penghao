package sample.bizfuse.web;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class BizfuseWebApplication {

	private static final Logger log = LoggerFactory.getLogger(BizfuseWebApplication.class);

	/**
	 * Main method, used to run the application.
	 *
	 * @param args
	 *            the command line arguments
	 * @throws UnknownHostException
	 *             if the local host name could not be resolved into an address
	 */
	public static void main(final String[] args) throws UnknownHostException {
		ConfigurableApplicationContext context = new SpringApplicationBuilder().sources(BizfuseWebApplication.class)
				.run(args);

		final Environment env = context.getEnvironment();
		BizfuseWebApplication.log.info(
				"\n----------------------------------------------------------\n\t"
						+ "Application '{}' is running! Access URLs:\n\t" + "Local: \t\thttp://127.0.0.1:{}\n\t"
						+ "External: \thttp://{}:{}\n----------------------------------------------------------",
				env.getProperty("spring.application.name"), env.getProperty("server.port"),
				InetAddress.getLocalHost().getHostAddress(), env.getProperty("server.port"));

		final String configServerStatus = env.getProperty("configserver.status");
		BizfuseWebApplication.log.info(
				"\n----------------------------------------------------------\n\t"
						+ "Config Server: \t{}\n----------------------------------------------------------",
				configServerStatus == null ? "Not found or not setup for this application" : configServerStatus);
	}

}
