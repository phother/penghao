package sample.bizfuse.web.fixtures;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import com.leadingsoft.bizfuse.base.authority.model.menu.SystemMenu;
import com.leadingsoft.bizfuse.base.authority.model.menu.SystemMenu.MenuType;
import com.leadingsoft.bizfuse.base.authority.model.role.Role;
import com.leadingsoft.bizfuse.base.authority.repository.menu.SystemMenuRepository;
import com.leadingsoft.bizfuse.base.authority.repository.role.RoleRepository;
import com.leadingsoft.bizfuse.base.authority.service.authorization.SystemAuthorizationService;

import sample.bizfuse.web.enums.Subject;
import sample.bizfuse.web.enums.TeacherLevel;
import sample.bizfuse.web.enums.TrafficLevel;
import sample.bizfuse.web.enums.Vehicle;
import sample.bizfuse.web.model.School;
import sample.bizfuse.web.model.Student;
import sample.bizfuse.web.model.Teacher;
import sample.bizfuse.web.model.authentication.User;
import sample.bizfuse.web.model.reimbursement.CurrencyReimburse;
import sample.bizfuse.web.model.reimbursement.ReimburseDetail;
import sample.bizfuse.web.model.reimbursement.TrafficReimburse;
import sample.bizfuse.web.model.reimbursement.TravelReimburse;
import sample.bizfuse.web.repository.SchoolRepository;
import sample.bizfuse.web.repository.StudentRepository;
import sample.bizfuse.web.repository.TeacherRepository;
import sample.bizfuse.web.repository.authentication.UserRepository;
import sample.bizfuse.web.repository.reimbursement.CurrencyReimburseRepository;
import sample.bizfuse.web.repository.reimbursement.TravelReimburseRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Profile("dev")
@Component
public class DevFixtures implements ApplicationListener<ContextRefreshedEvent> {

	@Autowired
	private TeacherRepository teacherRepository;
	@Autowired
	private StudentRepository studentRepository;
	@Autowired
	private SchoolRepository schoolRepository;
	@Autowired
	private UserFixtures userFixtures;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private SystemMenuRepository systemMenuRepository;
    @Autowired
	private CurrencyReimburseRepository currencyReimburseRepository;
    @Autowired
	private UserRepository userRepository;
    @Autowired
    private SystemAuthorizationService systemAuthorizationService;

    @Autowired
	private TravelReimburseRepository travelReimburseRepository;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		// 初始化用户数据（excel导入）
//		userFixtures.initTestData();
//		// 初始化权限数据，包括菜单、角色
//		initAuthenticationData();
//
//		initTestData();

//		initTestData1();

//		initTestData2();


	}

	private void initTestData2() {
		TravelReimburse travelReimburse = new TravelReimburse();

		travelReimburse.setDepId(1L);
		travelReimburse.setFoodAllowanceDays(12);
		travelReimburse.setFoodAllowanceNum(12);
		travelReimburse.setHeadOfResearchLaboratory("1212");
		travelReimburse.setHeadOfUnit("zhangsan");
		travelReimburse.setHotelExpense(new BigDecimal(12));
		travelReimburse.setName("wangwu");
		travelReimburse.setOtherFee(new BigDecimal(12));
		travelReimburse.setPersonInCharge("12121");
		travelReimburse.setProjectName("环境保护工程");
		travelReimburse.setReason("出差");
		travelReimburse.setReimburseTime(new Date());
		travelReimburse.setTrafficSubsidyDays(12);
		travelReimburse.setTrafficSubsidyNum(12);

		TrafficReimburse trafficReimburse = new TrafficReimburse();
		trafficReimburse.setDestination("一起去");
		trafficReimburse.setLevel(TrafficLevel.business_class);
		trafficReimburse.setSource("哈哈");
		trafficReimburse.setTrafficeFee(new BigDecimal(12));
		trafficReimburse.setVehicle(Vehicle.bus);

		List<TrafficReimburse> lists = new ArrayList<>();

		lists.add(trafficReimburse);

		travelReimburse.setTrafficReimburse(lists);

		travelReimburseRepository.save(travelReimburse);
	}

	private void initTestData1() {
		CurrencyReimburse model =new CurrencyReimburse();
		model.setDepId(1L);
		model.setHeadOfResearchLaboratory("张三");
		model.setHeadOfUnit("张三");
		model.setInvoiceCount(12);
		model.setMark("哈哈");
		model.setName("李四");
		model.setPersonInCharge("12121");
		model.setReimburseTime(new Date());
		model.setSumReimburse(BigDecimal.ONE);
		ReimburseDetail detail =new ReimburseDetail();
		detail.setRemark("12121");
		detail.setRemiburseMoney(BigDecimal.valueOf(123));
		detail.setSubId(Subject.chargeForWater);

		ReimburseDetail detail1 =new ReimburseDetail();
		detail1.setRemark("12121");
		detail1.setRemiburseMoney(BigDecimal.valueOf(123));
		detail1.setSubId(Subject.chargeForWater);

		List<ReimburseDetail> details = new ArrayList<>();
		details.add(detail);
		details.add(detail1);

		model.setDetails(details);

		currencyReimburseRepository.save(model);
	}

	private void initAuthenticationData() {

		// 角色
		String[][] roles = new String[][] {
			{ "admin", "管理员" },
			{ "access_manager", "访问管理员" }, { "session_manager", "会话管理员" },
			{ "app_manager", "应用管理员" }, { "operation_manager", "运维管理员" }
		};
		for (String[] roleDefine : roles) {
			Role role = new Role();
			role.setName(roleDefine[0]);
			role.setDescription(roleDefine[1]);
			this.roleRepository.save(role);
		}
		
		// 菜单
		Object[][] menus = new Object[][]{
			{MenuType.site, "菜单管理", "menuList", "#/system/menu/list.html", 1},
			{MenuType.site, "用户管理", "platformUserList", "#/system/platformUser/list.html", 2},
			{MenuType.site, "角色管理", "roleList", "#/system/role/list.html", 3},
			{MenuType.site, "码表管理", "dictionaryCategorys", "#/system/dictionary/category/list.html", 4},
			{MenuType.site, "Tree示例", "jsTreeDemo", "#/system/jsTreeDemo/list.html", 5},
			{MenuType.site, "图表示例", "echartsDemo", "#/system/echartsDemo/list.html", 6},
			{MenuType.site, "Ueditor示例", "ueditorDemo", "#/system/ueditorDemo/list.html", 7},
			{MenuType.site, "Map示例", "mapDemo", "#/system/mapDemo/list.html", 8},
			{MenuType.site, "日期日程示例", "angularFullCalendar", "#/system/angularFullCalendarDemo/list.html", 9},
			{MenuType.site, "流程图示例", "jsPlumbDemo", "#/system/jsPlumbDemo/list.html", 10},
			{MenuType.site, "D3示例", "D3Demo", "#/system/D3Demo/list.html", 11},
		};
		for(Object[] menuDefine : menus) {
			SystemMenu menu = new SystemMenu();
			menu.setType((MenuType)menuDefine[0]);
			menu.setTitle((String)menuDefine[1]);
			menu.setKey((String)menuDefine[2]);
			menu.setHref((String)menuDefine[3]);
			menu.setSortNum((Integer) menuDefine[4]);
			menu.setEnabled(true);
			this.systemMenuRepository.save(menu);
		}
		
		// 授权
		User admin = userRepository.findOneByLoginId("admin");
		Role adminRole = this.roleRepository.findOneByName("admin");
		if (admin != null) {
			this.systemAuthorizationService.grantRoleToUser(admin.getNo(), adminRole);
		}
	}

	private void initTestData() {

		School wudang = new School();
		wudang.setName("武当派");
		wudang.setAddress("湖北省武当山");
		this.schoolRepository.save(wudang);

		School emei = new School();
		emei.setName("峨眉派");
		emei.setAddress("四川省峨眉山");
		this.schoolRepository.save(emei);

		School mingjiao = new School();
		mingjiao.setName("明教");
		mingjiao.setAddress("光明顶");
		this.schoolRepository.save(mingjiao);

		final Teacher zhsf = new Teacher();
		zhsf.setName("张三丰");
		zhsf.setAge(120);
		zhsf.setTeachingAge(90);
		zhsf.setLevel(TeacherLevel.EXPERT);
		this.teacherRepository.save(zhsf);

		final Teacher xiexun = new Teacher();
		xiexun.setName("谢逊");
		xiexun.setAge(50);
		xiexun.setTeachingAge(30);
		xiexun.setLevel(TeacherLevel.SPECIAL);
		this.teacherRepository.save(xiexun);

		Teacher miejue = new Teacher();
		miejue.setName("灭绝师太");
		miejue.setAge(40);
		miejue.setTeachingAge(25);
		miejue.setLevel(TeacherLevel.SPECIAL);
		this.teacherRepository.save(miejue);

		final Student zhouzr = new Student();
		zhouzr.setName("周芷若");
		zhouzr.setGrade(5);
		zhouzr.getTeachers().add(miejue);
		zhouzr.setSchool(emei);
		this.studentRepository.save(zhouzr);

		final Student songyq = new Student();
		songyq.setName("宋远桥");
		songyq.setGrade(6);
		songyq.getTeachers().add(zhsf);
		songyq.setSchool(wudang);
		this.studentRepository.save(songyq);

		final Student zhcs = new Student();
		zhcs.setName("张翠山");
		zhcs.setGrade(3);
		zhcs.getTeachers().add(zhsf);
		zhcs.getTeachers().add(xiexun);
		zhcs.setSchool(wudang);
		zhcs.setGraduate(true);
		this.studentRepository.save(zhcs);

		final Student zhwj = new Student();
		zhwj.setName("张无忌");
		zhwj.setGrade(6);
		zhwj.getTeachers().add(zhsf);
		zhwj.getTeachers().add(xiexun);
		zhwj.setSchool(mingjiao);
		zhwj.getProfile().setPrimarySchool(wudang.getName());
		zhwj.getProfile().setMiddleSchool(mingjiao.getName());
		this.studentRepository.save(zhwj);

		final Student yinlt = new Student();
		yinlt.setName("殷梨亭");
		yinlt.setGrade(5);
		yinlt.getTeachers().add(zhsf);
		yinlt.setSchool(wudang);
		this.studentRepository.save(yinlt);

	}

}
