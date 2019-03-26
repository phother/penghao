package sample.bizfuse.web.excel.view;

import com.leadingsoft.bizfuse.common.web.view.BaseExcelView;
import com.leadingsoft.bizfuse.common.web.view.DefaultListDataExcelView;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.stereotype.Component;
import sample.bizfuse.web.dto.reimbursement.CurrencyReimburseDTO;
import sample.bizfuse.web.dto.reimbursement.ReimburseDetailDTO;
import sample.bizfuse.web.model.reimbursement.ReimburseDetail;
import sample.bizfuse.web.utils.DateStyle;
import sample.bizfuse.web.utils.DateUtils;
import sample.bizfuse.web.utils.UpperChineseUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;

/**
 * Created by PH on 2019/3/25.
 */
@Component
public class currencyReimburseExcelView extends BaseExcelView {

    public currencyReimburseExcelView() {
        super.setUrl("/excel/CurrencyReimburseExcelView.xls");
    }
    @Override
    protected void buildExcelDocumentContents(final Map<String, Object> model, final Workbook workbook,
                                              final HttpServletRequest request, final HttpServletResponse response) throws Exception {

        @SuppressWarnings("unchecked")
        final CurrencyReimburseDTO bean =
                (CurrencyReimburseDTO) model.get(DefaultListDataExcelView.DATAS);
        final CellStyle defaultCellStyle = this.buildDefaultCellStyle(workbook);
        CellStyle cellStyle = this.buildCellStyle(workbook);
        final Sheet sheet = workbook.getSheetAt(0);

        sheet.setDefaultRowHeight((short)(20*23));

        int rowNumber = 1;
        int colNumber = 0;

        Cell cell = null;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber, 0,1, defaultCellStyle);
        cell.setCellValue("部门:"+bean.getDepId());
        System.out.println(rowNumber);
        rowNumber++;
        System.out.println(rowNumber);

        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("姓名");

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,1,2, defaultCellStyle);
        cell.setCellValue(bean.getName());

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("日期");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, defaultCellStyle);
        cell.setCellValue(DateUtils.DateToString(bean.getReimburseTime(), DateStyle.YYYY_MM_DD_CN));

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,2, cellStyle);
        cell.setCellValue("摘    要");

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("科目");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, cellStyle);
        cell.setCellValue("金额(元)");



        List<ReimburseDetailDTO> details = bean.getDetails();
        for (final ReimburseDetailDTO detail : details) {
            rowNumber++;
            cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,2, defaultCellStyle);
            cell.setCellValue(detail.getRemark()+"");

            cell = this.buildMergedRowCell(sheet, rowNumber, 3, defaultCellStyle);
            cell.setCellValue(detail.getSubId()+"");

            cell = this.buildMergedRowCell(sheet, rowNumber, 4, defaultCellStyle);
            cell.setCellValue(detail.getRemiburseMoney() +"");
        }
        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("人民币/元（大写）");

        BigDecimal num = new BigDecimal(0);
        for(ReimburseDetailDTO detail : details){
            num = num.add(detail.getRemiburseMoney());
        }

        System.out.println(num);

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,1,2, defaultCellStyle);
        cell.setCellValue(UpperChineseUtils.moneyToChinese(num));

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("人民币/元（小写）");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, defaultCellStyle);
        cell.setCellValue(num+"");

        rowNumber++;
        cell = this.buildMergedRowCell(sheet, rowNumber,0, cellStyle);
        cell.setCellValue("备注");


        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,1,2, defaultCellStyle);
        cell.setCellValue(bean.getMark());

        cell = this.buildMergedRowCell(sheet, rowNumber,3, cellStyle);
        cell.setCellValue("发票数量（张）");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, defaultCellStyle);
        cell.setCellValue(bean.getInvoiceCount());
        rowNumber++;
        rowNumber++;

        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,0,1, defaultCellStyle);
        cell.setCellValue("单位负责人：");


        cell = this.buildMergedRowCell(sheet, rowNumber,rowNumber,2,3, defaultCellStyle);
        cell.setCellValue("经办人：");

        cell = this.buildMergedRowCell(sheet, rowNumber,4, defaultCellStyle);
        cell.setCellValue("研究室负责人：");





//        if (beans != null) {

//            for (final ShowFilmInfoAnalysisDTO bean : beans) {
//
//                final DecimalFormat decimalFormat = new DecimalFormat();
//                decimalFormat.setMaximumFractionDigits(2);
//
//                // 月份

//                // 放映情况
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(bean.getPayTypeStr0());
//                // 票房
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getTotalBoxOffice0() == null ? 0 : bean.getTotalBoxOffice0().doubleValue());
//                //票房同比
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getBoxOfficeRate0() == null ? "0" : decimalFormat.format(bean.getBoxOfficeRate0()));
//                // 人次
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(bean.getAudiences0());
//                // 人次同比
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getAudiencesRate0() == null ? "0" : decimalFormat.format(bean.getAudiencesRate0()));
//                // 场次
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(bean.getSessions0() == null ? 0L : bean.getSessions0());
//                // 场次同比
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getSessionsRate0() == null ? "0" : decimalFormat.format(bean.getSessionsRate0()));
//                // 放映情况
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(bean.getPayTypeStr2());
//                // 票房
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getTotalBoxOffice2() == null ? 0 : bean.getTotalBoxOffice2().doubleValue());
//                //票房同比
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getBoxOfficeRate2() == null ? "0" : decimalFormat.format(bean.getBoxOfficeRate2()));
//                // 人次
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(bean.getAudiences2() == null ? 0L : bean.getAudiences2());
//                // 人次同比
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getAudiencesRate2() == null ? "0" : decimalFormat.format(bean.getAudiencesRate2()));
//                // 场次
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(bean.getSessions2() == null ? 0L : bean.getSessions2());
//                // 场次同比
//                cell = this.buildMergedRowCell(sheet, rowNumber, colNumber++, defaultCellStyle);
//                cell.setCellValue(
//                        bean.getSessionsRate2() == null ? "0" : decimalFormat.format(bean.getSessionsRate2()));
//            }
//        }

    }
    @Override
    protected Cell buildMergedRowCell(Sheet sheet, int rowStart, int rowEnd, int colStart, int colEnd, CellStyle cellStyle) {
        cellStyle.setAlignment(CellStyle.ALIGN_CENTER);//水平居中
        cellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);//垂直居中

        CellRangeAddress ca = new CellRangeAddress(rowStart, rowEnd, colStart, colEnd);
        sheet.addMergedRegion(ca);
        Row row = sheet.getRow(rowStart);
        if(row == null) {
            row = sheet.createRow(rowStart);
        }
        row.setHeight((short)(20*23));


        Cell cell = row.createCell(colStart);
        cell.setCellStyle(cellStyle);
        for(int i = colStart;i<=colEnd;i++){
            Cell c = row.createCell(i);
            c.setCellStyle(cellStyle);
        }

        return cell;
    }
    @Override
    protected Cell buildCell(Sheet sheet, int rowNumber, int colNumber, CellStyle cellStyle) {
        Row row = sheet.getRow(rowNumber);
        if(row == null) {
            row = sheet.createRow(rowNumber);
        }
        row.setHeight((short)(20*23));

        Cell cell = row.createCell(colNumber);
        cell.setCellStyle(cellStyle);
        return cell;
    }

    private static void setRegionStyle(Sheet sheet, CellRangeAddress region,
                                       CellStyle cs) {
        for (int i = region.getFirstRow(); i <= region.getLastRow(); i++) {
            Row row = sheet.getRow(i);
            Cell cell = null;
            //循环设置单元格样式
            for (int j = region.getFirstColumn(); j <= region.getLastColumn(); j++) {
                cell = row.getCell(j);
                cell.setCellStyle(cs);
            }
        }
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
