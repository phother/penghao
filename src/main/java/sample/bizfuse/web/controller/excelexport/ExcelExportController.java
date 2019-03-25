package sample.bizfuse.web.controller.excelexport;

import java.util.Arrays;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.leadingsoft.bizfuse.common.web.view.DefaultListDataExcelView;
import com.leadingsoft.bizfuse.common.web.view.DefaultListDataExcelView.CellEditor;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import sample.bizfuse.web.model.Student;
import sample.bizfuse.web.repository.StudentRepository;

/**
 * 数据的 Excel 导出的测试接口
 */
@Slf4j
@RestController
@RequestMapping("/api/excel")
@Api(tags = {"数据的Excel导出测试API" })
public class ExcelExportController {
	
	private static final String EXCEL_VIEW = "defaultListDataExcelView";

	@Autowired
	private StudentRepository studentRepository;
	
    /**
     * 不用Excel模板的数据导出API，适用于对导出格式要求不高的场景
     *
     * @return
     */
	@ApiOperation(value = "不用Excel模板的数据导出A", notes = "")
    @RequestMapping(value = "/export/withoutTemplate", method = RequestMethod.GET)
    public ModelAndView exportWithoutTemplate() {
    	log.info("不用Excel模板的数据导出测试.");
    	
    	List<Student> students = studentRepository.findAll();
        final ModelMap modelMap = new ModelMap();

        // 指定下载文件名
        modelMap.addAttribute(DefaultListDataExcelView.FILENAME, "学生信息.xls");

        // 数据对象
        modelMap.addAttribute(DefaultListDataExcelView.DATAS, students);

        // 定义数据列在Excel表头中显示的名字
        modelMap.addAttribute(DefaultListDataExcelView.HEADER_NAMES,
                Arrays.asList("姓名", "年级", "学校", "是否毕业", "创建日期", "操作人"));
        
        // 定义数据要输出到Excel的字段（按顺序输出），对应数据对象中的 field 名
        // 注意：对于特殊Cell格式的支持，目前仅实现了日期(date)和时间戳(timestamp)，如有其它需求请告知，日期格式举例：
        // 如果有一列需要显示日期格式，比如 ”创建日“， 在定义Header列表时，在header名后冒号分割，后加Cell类型，举例如下：
        modelMap.addAttribute(DefaultListDataExcelView.HEADERS,
                Arrays.asList("name", "grade", "school.name", "graduate", "createdDate:date", "createdBy"));

        // 如果个别字段需要特殊处理， 比如 boolean型或枚举类型，需要显示为汉字，需要自定义字段编辑器，请参考下面的写法：
        // 自定义列编辑: 状态字段
        CellEditor graduateEditor = new CellEditor() {
			@Override
			public void setCellValue(Cell cell, Object rowData) {
				Student s = (Student) rowData;
				if (s.isGraduate()) {
					cell.setCellValue("已毕业");
				} else {
					cell.setCellValue("未毕业");
				}
			}
			@Override
			public String getHeader() {
				return "graduate";
			}
        };
        modelMap.addAttribute(DefaultListDataExcelView.CELL_EDITORS, Arrays.asList(graduateEditor));

        return new ModelAndView(EXCEL_VIEW, modelMap);
    }
    
    /**
     * 使用Excel模板的数据导出API，适用于对导出格式要求较高的场景
     *
     * @return
     */
	@ApiOperation(value = "使用Excel模板的数据导出A", notes = "")
    @RequestMapping(value = "/export/withTemplate", method = RequestMethod.GET)
    public ModelAndView generateExcelByTemplate() {
    	log.info("使用Excel模板的数据导出测试.");
    	
    	List<Student> students = studentRepository.findAll();
        final ModelMap modelMap = new ModelMap();

        // 指定下载文件名
        modelMap.addAttribute(DefaultListDataExcelView.FILENAME, "学生信息（美化版）.xls");
        
       // 模板文件名
        modelMap.addAttribute(DefaultListDataExcelView.TEMPLATE_URL, "/excel/students.xls");

        // 数据对象
        modelMap.addAttribute(DefaultListDataExcelView.DATAS, students);
        
        // 定义数据要输出到Excel的字段（按顺序输出），对应数据对象中的 field 名
        // 注意：对于特殊Cell格式的支持，目前仅实现了日期(date)和时间戳(timestamp)，如有其它需求请告知，日期格式举例：
        // 如果有一列需要显示日期格式，比如 ”创建日“， 在定义Header列表时，在header名后冒号分割，后加Cell类型，举例如下：
        modelMap.addAttribute(DefaultListDataExcelView.HEADERS,
                Arrays.asList("name", "grade", "school.name", "graduate", "createdDate:date", "createdBy"));

        // 如果个别字段需要特殊处理， 比如 boolean型或枚举类型，需要显示为汉字，需要自定义字段编辑器，请参考下面的写法：
        // 自定义列编辑: 状态字段
        CellEditor graduateEditor = new CellEditor() {
			@Override
			public void setCellValue(Cell cell, Object rowData) {
				Student s = (Student) rowData;
				if (s.isGraduate()) {
					cell.setCellValue("已毕业");
				} else {
					cell.setCellValue("未毕业");
				}
			}
			@Override
			public String getHeader() {
				return "graduate";
			}
        };
        modelMap.addAttribute(DefaultListDataExcelView.CELL_EDITORS, Arrays.asList(graduateEditor));

        return new ModelAndView(EXCEL_VIEW, modelMap);
    }
}
