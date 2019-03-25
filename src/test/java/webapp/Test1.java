package webapp;

import com.leadingsoft.bizfuse.sourcegenerator.impl.*;
import com.leadingsoft.bizfuse.sourcegenerator.utils.Configuration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.MimeTypeUtils;
import sample.bizfuse.web.BizfuseWebApplication;
import sample.bizfuse.web.SourceGenerator;

@RunWith(SpringRunner.class)
@SpringBootTest(classes={BizfuseWebApplication.class})
public class Test1 {
	enum Output {
		file, console
	}

	public static void main(String[] args) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "Content-Type: text/xml");
		System.out.println(headers.getContentType());
	}

	@Test
	public void testOne() throws ClassNotFoundException {
		final String modelBasePackage = "sample.bizfuse.web.model.reimbursement";
		final String[] models = new String[] {"CurrencyReimburse" };

		final Test1.Output output = Test1.Output.file; // console 或 file
		boolean override = false; // 除非万不得已，默认不要覆盖本地文件

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///// 生产代码逻辑
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if (output != Test1.Output.file) {
			override = false;
		}
		final String outputDir = null;
		for (final String modelClass : models) {
			final Class<?> modelClazz = Class.forName(modelBasePackage + "." + modelClass);
			final Configuration config = new Configuration(modelClazz, output.name(), outputDir, override);
			final RepositoryGenerator repositoryGenerator = new RepositoryGenerator(config);
			final ServiceGenerator serviceGenerator = new ServiceGenerator(config);
			final ServiceImplGenerator serviceImplGenerator = new ServiceImplGenerator(config);
			final DtoGenerator dtoGenerator = new DtoGenerator(config);
			final ConvertorGenerator convertorGenerator = new ConvertorGenerator(config);
			final ControllerGenerator controllerGenerator = new ControllerGenerator(config);
			repositoryGenerator.generate();   // 生成Repository
			serviceGenerator.generate();          // 生成Service 接口
			serviceImplGenerator.generate(); // 生成Service 实例
			dtoGenerator.generate();                 // 生成DTO
			convertorGenerator.generate();    // 生成Converter
			controllerGenerator.generate();    // 生成Controller
		}
	}
	}


