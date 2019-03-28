package sample.bizfuse.web.excel.view;

import com.leadingsoft.bizfuse.common.web.view.BaseExcelView;
import com.leadingsoft.bizfuse.common.web.view.DefaultListDataExcelView;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;
import sample.bizfuse.web.dto.reimbursement.CurrencyReimburseDTO;
import sample.bizfuse.web.dto.reimbursement.ReimburseDetailDTO;
import sample.bizfuse.web.dto.reimbursement.TrafficReimburseDTO;
import sample.bizfuse.web.dto.reimbursement.TravelReimburseDTO;
import sample.bizfuse.web.enums.Subject;
import sample.bizfuse.web.utils.DateStyle;
import sample.bizfuse.web.utils.DateUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * Created by PH on 2019/3/28.
 */
@Component
public class travelReimburseExcelView extends BaseExcelView {

    public travelReimburseExcelView() {
        super.setUrl("/excel/travelReimburseExcelView.xls");
    }
    @Override
    protected void buildExcelDocumentContents(final Map<String, Object> model, final Workbook workbook,
                                              final HttpServletRequest request, final HttpServletResponse response) throws Exception {

        @SuppressWarnings("unchecked") final TravelReimburseDTO bean =
                (TravelReimburseDTO) model.get(DefaultListDataExcelView.DATAS);
        final CellStyle defaultCellStyle = this.buildDefaultCellStyle(workbook);
        CellStyle cellStyle = this.buildCellStyle(workbook);
        final Sheet sheet = workbook.getSheetAt(0);

        sheet.setDefaultRowHeight((short) (20 * 23));

        int rowNumber = 1;
        int colNumber = 0;

        Cell cell = null;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber, 0,1, defaultCellStyle);
        cell.setCellValue("部门:"+bean.getDepId());

        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("姓名");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,1,2, defaultCellStyle);
        cell.setCellValue(bean.getName());

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("日期");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,4,5, defaultCellStyle);
        cell.setCellValue(DateUtils.DateToString(bean.getReimburseTime(), DateStyle.YYYY_MM_DD_CN));

        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("出差事由");

        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("项目名称");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,4, cellStyle);
        cell.setCellValue("费用明细");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,5, cellStyle);
        cell.setCellValue("金额:元");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,4, cellStyle);
        cell.setCellValue("住宿费 （填本次报销所有房费合计数）");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, defaultCellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, cellStyle);
        cell.setCellValue("交通伙食补助");

        cell = this.buildMergedRowCell(sheet, rowNumber,2, cellStyle);
        cell.setCellValue("补助标准");

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("天数");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, cellStyle);
        cell.setCellValue("人数");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, cellStyle);
        cell.setCellValue("金额");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, cellStyle);
        cell.setCellValue("交通补助");

        cell = this.buildMergedRowCell(sheet, rowNumber,2, cellStyle);
        cell.setCellValue("80");

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("10");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, cellStyle);
        cell.setCellValue("10");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, cellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, cellStyle);
        cell.setCellValue("伙食补助");

        cell = this.buildMergedRowCell(sheet, rowNumber,2, cellStyle);
        cell.setCellValue("100");

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("10");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, cellStyle);
        cell.setCellValue("10");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, cellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,4, cellStyle);
        cell.setCellValue("其他费用（订票服务费、退票改签费）");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, defaultCellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,4, cellStyle);
        cell.setCellValue("小计");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, defaultCellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("年月日");

        cell = this.buildMergedRowCell(sheet, rowNumber,1, cellStyle);
        cell.setCellValue("启程地点");

        cell = this.buildMergedRowCell(sheet, rowNumber,2, cellStyle);
        cell.setCellValue("到达地点");

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("交通工具");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, cellStyle);
        cell.setCellValue("座位等级");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, cellStyle);
        cell.setCellValue("金额(元)");

        List<TrafficReimburseDTO> details = bean.getTrafficReimburse();
        for (final TrafficReimburseDTO detail : details) {
            rowNumber++;
            cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
            cell.setCellValue("年月日");

            cell = this.buildMergedRowCell(sheet, rowNumber,1, cellStyle);
            cell.setCellValue("启程地点");

            cell = this.buildMergedRowCell(sheet, rowNumber,2, cellStyle);
            cell.setCellValue("到达地点");

            cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
            cell.setCellValue("交通工具");

            cell = this.buildMergedRowCell(sheet, rowNumber,4, cellStyle);
            cell.setCellValue("座位等级");

            cell = this.buildMergedRowCell(sheet, rowNumber,5, cellStyle);
            cell.setCellValue("金额(元)");
        }

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,4, cellStyle);
        cell.setCellValue("小计");

        cell = this.buildMergedRowCell(sheet, rowNumber,5, defaultCellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, cellStyle);
        cell.setCellValue("合计（大写）");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,2,5, defaultCellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, cellStyle);
        cell.setCellValue("合计（小写）");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,2,5, defaultCellStyle);
        cell.setCellValue("0.00");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, defaultCellStyle);
        cell.setCellValue("单位负责人:");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,2,3, defaultCellStyle);
        cell.setCellValue("经办人");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,4,5, defaultCellStyle);
        cell.setCellValue("研究室负责人:");






    }


    protected CellStyle buildCellStyle(Workbook workbook) {
        CellStyle defaultCellStyle = workbook.createCellStyle();
        defaultCellStyle.setWrapText(true);
        defaultCellStyle.setRightBorderColor((short)23);
        defaultCellStyle.setBorderBottom((short)1);
        defaultCellStyle.setBorderLeft((short)1);
        defaultCellStyle.setBorderTop((short)1);
        defaultCellStyle.setBorderRight((short)1);
        defaultCellStyle.setVerticalAlignment((short)1);
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short)12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);//粗体显示
        defaultCellStyle.setFont(font);
        return defaultCellStyle;
    }
}
