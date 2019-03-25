package sample.bizfuse.web.config.database;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;


@Configuration
@EnableJpaAuditing
public class DatabaseConfiguration {

	/**
	 * Support serialisation of lazy loaded POJOs
	 * @return
	 */
    @Bean
    public Hibernate5Module hibernate5Module() {
        return new Hibernate5Module();
    }
}
