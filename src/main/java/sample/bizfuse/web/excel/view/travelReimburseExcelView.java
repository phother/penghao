package sample.bizfuse.web.excel.view;

import com.leadingsoft.bizfuse.common.web.view.BaseExcelView;
import com.leadingsoft.bizfuse.common.web.view.DefaultListDataExcelView;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import sample.bizfuse.web.dto.reimbursement.TrafficReimburseDTO;
import sample.bizfuse.web.dto.reimbursement.TravelReimburseDTO;
import sample.bizfuse.web.enums.TrafficLevel;
import sample.bizfuse.web.enums.Vehicle;
import sample.bizfuse.web.repository.base.DepartmentRepository;
import sample.bizfuse.web.utils.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

/**
 * Created by PH on 2019/3/28.
 */
@Component
public class travelReimburseExcelView extends BaseExcelView {

    @Autowired
    private DepartmentRepository departmentRepository;

    public travelReimburseExcelView() {
        super.setUrl("/excel/travelReimburseExcelView.xls");
    }

    @Override
    protected void buildExcelDocumentContents(final Map<String, Object> model, final Workbook workbook,
                                              final HttpServletRequest request, final HttpServletResponse response) throws Exception {

        @SuppressWarnings("unchecked") final TravelReimburseDTO bean =
                (TravelReimburseDTO) model.get(DefaultListDataExcelView.DATAS);
        final CellStyle defaultCellStyle = this.buildDefaultCellStyle(workbook);
        CellStyle titleCellStyle = this.buildTitleCellStyle(workbook);
        CellStyle inputCellStyle = this.buildInputCellStyle(workbook);
        final Sheet sheet = workbook.getSheetAt(0);

        sheet.setDefaultRowHeight((short) (20 * 23));

        int rowNumber = 1;
        int colNumber = 0;

        Cell cell = null;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, defaultCellStyle);
        cell.setCellValue( "部门:"+departmentRepository.findOne(bean.getDepId()).getName());

        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber, 0, titleCellStyle);
        cell.setCellValue("姓名");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 1, 2, inputCellStyle);
        cell.setCellValue(bean.getName());

        cell = this.buildMergedRowCell(sheet, rowNumber, 3, titleCellStyle);
        cell.setCellValue("日期");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 4, 5, inputCellStyle);
        cell.setCellValue(DateUtils.DateToString(bean.getReimburseTime(), DateStyle.YYYY_MM_DD_CN));

        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber, 0, titleCellStyle);
        cell.setCellValue("出差事由");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 1, 5, inputCellStyle);
        cell.setCellValue(bean.getReason());

        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber, 0, titleCellStyle);
        cell.setCellValue("项目名称");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 1, 5, inputCellStyle);
        cell.setCellValue(bean.getProjectName());

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 4, titleCellStyle);
        cell.setCellValue("费用明细");
        cell = this.buildMergedRowCell(sheet, rowNumber, 5, titleCellStyle);
        cell.setCellValue("金额:元");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 4, titleCellStyle);
        cell.setCellValue("住宿费 （填本次报销所有房费合计数）");

        cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);
        cell.setCellValue(String.valueOf(bean.getHotelExpense()));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, titleCellStyle);
        cell.setCellValue("交通伙食补助");

        cell = this.buildMergedRowCell(sheet, rowNumber, 2, titleCellStyle);
        cell.setCellValue("补助标准");

        cell = this.buildMergedRowCell(sheet, rowNumber, 3, titleCellStyle);
        cell.setCellValue("天数");

        cell = this.buildMergedRowCell(sheet, rowNumber, 4, titleCellStyle);
        cell.setCellValue("人数");

        cell = this.buildMergedRowCell(sheet, rowNumber, 5, titleCellStyle);
        cell.setCellValue("金额");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, titleCellStyle);
        cell.setCellValue("交通补助");

        cell = this.buildMergedRowCell(sheet, rowNumber, 2, inputCellStyle);
        cell.setCellValue(String.valueOf(Constants.trafficSubsidylevel));

        cell = this.buildMergedRowCell(sheet, rowNumber, 3, inputCellStyle);
        cell.setCellValue(bean.getTrafficSubsidyDays());

        cell = this.buildMergedRowCell(sheet, rowNumber, 4, inputCellStyle);
        cell.setCellValue(bean.getTrafficSubsidyNum());

        BigDecimal trafficSubsidy = calulate(Constants.trafficSubsidylevel,bean.getTrafficSubsidyDays(),bean.getTrafficSubsidyNum());
        cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);
        cell.setCellValue(String.valueOf(trafficSubsidy));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, titleCellStyle);
        cell.setCellValue("伙食补助");

        cell = this.buildMergedRowCell(sheet, rowNumber, 2, inputCellStyle);
        cell.setCellValue(String.valueOf(Constants.foodSubsidylevel));

        cell = this.buildMergedRowCell(sheet, rowNumber, 3, inputCellStyle);
        cell.setCellValue(bean.getFoodAllowanceDays());

        cell = this.buildMergedRowCell(sheet, rowNumber, 4, inputCellStyle);
        cell.setCellValue(bean.getFoodAllowanceNum());

        BigDecimal foodSubsidy = calulate(Constants.foodSubsidylevel,bean.getFoodAllowanceDays(),bean.getFoodAllowanceNum());
        cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);
        cell.setCellValue(String.valueOf(foodSubsidy));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 4, titleCellStyle);
        cell.setCellValue("其他费用（订票服务费、退票改签费）");

        cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);
        cell.setCellValue(String.valueOf(bean.getOtherFee()));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 4, titleCellStyle);
        cell.setCellValue("小计");

        cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);

        BigDecimal addtion1 =add(bean.getHotelExpense(),trafficSubsidy,bean.getOtherFee(),foodSubsidy);
        cell.setCellValue(String.valueOf(addtion1));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, 0, titleCellStyle);
        cell.setCellValue("年月日");

        cell = this.buildMergedRowCell(sheet, rowNumber, 1, titleCellStyle);
        cell.setCellValue("启程地点");

        cell = this.buildMergedRowCell(sheet, rowNumber, 2, titleCellStyle);
        cell.setCellValue("到达地点");

        cell = this.buildMergedRowCell(sheet, rowNumber, 3, titleCellStyle);
        cell.setCellValue("交通工具");

        cell = this.buildMergedRowCell(sheet, rowNumber, 4, titleCellStyle);
        cell.setCellValue("座位等级");

        cell = this.buildMergedRowCell(sheet, rowNumber, 5, titleCellStyle);
        cell.setCellValue("金额(元)");

        BigDecimal addtion2 =new BigDecimal(0);
        List<TrafficReimburseDTO> details = bean.getTrafficReimburse();
        for (final TrafficReimburseDTO detail : details) {
            rowNumber++;
            cell = this.buildMergedRowCell(sheet, rowNumber, 0, inputCellStyle);
            cell.setCellValue("年月日");

            cell = this.buildMergedRowCell(sheet, rowNumber, 1, inputCellStyle);
            cell.setCellValue(detail.getSource());

            cell = this.buildMergedRowCell(sheet, rowNumber, 2, inputCellStyle);
            cell.setCellValue(detail.getDestination());

            cell = this.buildMergedRowCell(sheet, rowNumber, 3, inputCellStyle);
            cell.setCellValue(detail.getVehicle().getValue());

            cell = this.buildMergedRowCell(sheet, rowNumber, 4, inputCellStyle);
            cell.setCellValue(detail.getLevel().getValue());

            cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);
            cell.setCellValue(String.valueOf(detail.getTrafficeFee()));
            addtion2 = addtion2.add(detail.getTrafficeFee().setScale(2, RoundingMode.HALF_UP));
        }

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 4, titleCellStyle);
        cell.setCellValue("小计");

        cell = this.buildMergedRowCell(sheet, rowNumber, 5, inputCellStyle);
        cell.setCellValue(String.valueOf(addtion2));

        rowNumber++;
        BigDecimal sum  = add(addtion1,addtion2);
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, titleCellStyle);
        cell.setCellValue("合计（大写）");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 2, 5, inputCellStyle);
        cell.setCellValue(UpperChineseUtils.moneyToChinese(sum));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, titleCellStyle);
        cell.setCellValue("合计（小写）");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 2, 5, inputCellStyle);
        cell.setCellValue(String.valueOf(sum));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 0, 1, defaultCellStyle);
        cell.setCellValue("单位负责人:");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 2, 3, defaultCellStyle);
        cell.setCellValue("经办人");

        cell = this.buildMergedRowCell(sheet, rowNumber, rowNumber, 4, 5, defaultCellStyle);
        cell.setCellValue("研究室负责人:");


    }


    protected CellStyle buildTitleCellStyle(Workbook workbook) {

        CellStyle defaultCellStyle = workbook.createCellStyle();
        defaultCellStyle.setAlignment(CellStyle.ALIGN_CENTER);//水平居中
        defaultCellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);//垂直居中
        defaultCellStyle.setWrapText(true);
        defaultCellStyle.setRightBorderColor((short) 23);
        defaultCellStyle.setBorderBottom((short) 1);
        defaultCellStyle.setBorderLeft((short) 1);
        defaultCellStyle.setBorderTop((short) 1);
        defaultCellStyle.setBorderRight((short) 1);
        defaultCellStyle.setVerticalAlignment((short) 1);
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);//粗体显示
        defaultCellStyle.setFont(font);
        return defaultCellStyle;
    }

    protected CellStyle buildInputCellStyle(Workbook workbook) {

        CellStyle defaultCellStyle = workbook.createCellStyle();
        defaultCellStyle.setAlignment(CellStyle.ALIGN_CENTER);//水平居中
        defaultCellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);//垂直居中
        defaultCellStyle.setWrapText(true);
        defaultCellStyle.setRightBorderColor((short) 23);
        defaultCellStyle.setBorderBottom((short) 1);
        defaultCellStyle.setBorderLeft((short) 1);
        defaultCellStyle.setBorderTop((short) 1);
        defaultCellStyle.setBorderRight((short) 1);
        defaultCellStyle.setVerticalAlignment((short) 1);
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 12);
        defaultCellStyle.setFont(font);
        return defaultCellStyle;
    }

    @Override
    protected Cell buildMergedRowCell(Sheet sheet, int rowStart, int rowEnd, int colStart, int colEnd, CellStyle cellStyle) {

        CellRangeAddress ca = new CellRangeAddress(rowStart, rowEnd, colStart, colEnd);
        sheet.addMergedRegion(ca);
        Row row = sheet.getRow(rowStart);
        if (row == null) {
            row = sheet.createRow(rowStart);
        }
        row.setHeight((short) (20 * 23));

        Cell cell = row.createCell(colStart);
        cell.setCellStyle(cellStyle);
        for (int i = colStart; i <= colEnd; i++) {
            Cell c = row.createCell(i);
            c.setCellStyle(cellStyle);
        }

        return cell;
    }
    //计算交通补助和伙食补助
    public static BigDecimal calulate(BigDecimal v1, int v2, int v3) {

        BigDecimal v = NumberUtil.mul(v2,v3);

        return v1.multiply(v).setScale(2,BigDecimal.ROUND_HALF_UP);

    }

    public static BigDecimal add(BigDecimal ...i){

        BigDecimal result = new BigDecimal(0);

        for(BigDecimal j : i){  //java把可变参数当做数组处理

            result = result.add(j);

        }
       return result.setScale(2,BigDecimal.ROUND_HALF_UP);
    }

}
