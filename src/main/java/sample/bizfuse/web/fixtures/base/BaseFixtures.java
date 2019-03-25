package sample.bizfuse.web.fixtures.base;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.supercsv.cellprocessor.ift.CellProcessor;
import org.supercsv.io.CsvBeanReader;
import org.supercsv.io.CsvListReader;
import org.supercsv.io.ICsvBeanReader;
import org.supercsv.io.ICsvListReader;
import org.supercsv.prefs.CsvPreference;

import lombok.extern.slf4j.Slf4j;

/**
 * 数据准备基础类
 */
@Slf4j
public class BaseFixtures {
    protected final String fixtureName;

    protected long total = 0;
    protected long successCount = 0;
    protected String faildInfo;//行号,数据名称,code/id,失败原因
    protected String successInfo;

    protected BaseFixtures(String fixtureName) {
        if (!StringUtils.hasText(fixtureName)) {
            fixtureName = "未指定";
        }

        this.fixtureName = fixtureName;
        this.successInfo = "正在处理,生产数据," + this.fixtureName + ",第%s行,%s,%s,处理成功,";
        this.faildInfo = "正在处理,生产数据," + this.fixtureName + ",第%s行,%s,%s,处理失败,%s";
    }

    /**
     * 生产数据准备
     */
    @Transactional
    public void initData() {
        BaseFixtures.log.info("[" + this.fixtureName + "]生产数据准备开始。");
        try {
            final long startTime = System.currentTimeMillis();
            this.prepareData();
            final long endTime = System.currentTimeMillis();
            BaseFixtures.log.info(String.format("CSV中共有%s条记录，成功导入%s条，失败%s条。", this.total, this.successCount,
                    this.total - this.successCount));
            BaseFixtures.log.info(String.format("共耗时：%s分钟", (endTime - startTime) / (1000 * 60)));
            BaseFixtures.log.info("[" + this.fixtureName + "]生产数据准备结束。");
        } catch (final Exception e) {
            BaseFixtures.log.warn("[" + this.fixtureName + "]生产数据准备失败。", e);
        }
        this.total = 0;
        this.successCount = 0;
    }

    /**
     * 测试数据准备
     */
    public void initTestData() {
        BaseFixtures.log.info("[" + this.fixtureName + "]测试数据准备开始。");
        try {
            this.prepareTestData();
        } catch (final Exception e) {
            BaseFixtures.log.warn("[" + this.fixtureName + "]测试数据准备失败。", e);
        }
        BaseFixtures.log.info("[" + this.fixtureName + "]测试数据准备结束。");
    }

    /**
     * 生产数据准备
     */
    protected void prepareData() {
        // noop
    }

    /**
     * 测试数据准备
     */
    protected void prepareTestData() {
        // noop
    }

    public boolean hasProdDataImported() {
        return false;
    }

    public boolean hasTestDataImported() {
        return false;
    }

    public String getDropTableScripts() {
        return "不知道哪~";
    }

    /**
     * CSV加载生产数据
     */
    public static final <T> void loadCSVData(final String dataType, final Class<T> clazz,
            final CsvProcessor<T> csvProcessor) {
        BaseFixtures.loadCSVData(dataType, clazz, clazz.getSimpleName().replaceAll("DTO", "") + ".csv", csvProcessor);
    }

    public static final <T> void loadCSVDataObjectList(final String dataType, final String csvFileName,
            final CsvListProcessor csvProcessor) {
        BaseFixtures.loadCSVObjectList(dataType, csvFileName + ".csv", csvProcessor);
    }

    /**
     * CSV加载测试数据
     */
    public static final <T> void loadCSVTestData(final String dataType, final Class<T> clazz,
            final CsvProcessor<T> csvProcessor) {
        BaseFixtures.loadCSVData(dataType, clazz, clazz.getSimpleName().replaceAll("DTO", "") + "_test.csv",
                csvProcessor);
    }

    /**
     * CSV加载数据
     */
    private static final <T> void loadCSVData(final String dataType, final Class<T> clazz, final String csvFilename,
            final CsvProcessor<T> csvProcessor) {
        ICsvBeanReader beanReader = null;
        try {
            final InputStream resourceAsStream = BaseFixtures.getCSvDataStream(csvFilename);
            beanReader = BaseFixtures.loadDataFromStream(dataType, clazz, csvProcessor, resourceAsStream);
        } catch (final Exception e) {
            String message;
            if (beanReader != null) {
                message =
                        "[" + dataType + "]数据加载解析失败，文件行号： " + beanReader.getLineNumber() + ":"
                                + beanReader.getRowNumber()
                                + ":" + beanReader.getUntokenizedRow() + " @ " + csvFilename;
            } else {
                message =
                        "[" + dataType + "]数据加载解析失败。 @ " + csvFilename;
            }
            BaseFixtures.log.warn(message, e);
        } finally {
            if (beanReader != null) {
                try {
                    beanReader.close();
                } catch (final IOException e) {
                    // noop
                }
            }
        }
    }

    private static InputStream getCSvDataStream(final String csvFilename) throws IOException {
        final File file = new File("../data/" + csvFilename);
        if (file.exists()) {
            BaseFixtures.log.info("正在加载文件： " + file.getCanonicalPath());
            return new FileInputStream(file);
        } else {
            BaseFixtures.log.info("正在通过Classpath加载文件： " + csvFilename);

            final InputStream resourceAsStream = BaseFixtures.class.getResourceAsStream("/data/" + csvFilename);
            if (resourceAsStream == null) {
                BaseFixtures.log.warn("通过Classpath加载文件失败： " + csvFilename);
                throw new IOException("通过Classpath加载文件失败： " + csvFilename);
            }
            return resourceAsStream;
        }
    }

    private static <T> ICsvBeanReader loadDataFromStream(final String dataType, final Class<T> clazz,
            final CsvProcessor<T> csvProcessor, final InputStream resourceAsStream) throws IOException {
        ICsvBeanReader beanReader;
        beanReader = new CsvBeanReader(new InputStreamReader(resourceAsStream), CsvPreference.STANDARD_PREFERENCE);
        // the header elements are used to map the values to the bean (names
        // must match)
        final String[] header = beanReader.getHeader(true);

        T data;
        final CellProcessor[] processors = csvProcessor.getProcessors();

        while ((data = beanReader.read(clazz, header, processors)) != null) {
            BaseFixtures.log.info(
                    "[" + dataType + "]数据加载中： " + beanReader.getLineNumber() + ":"
                            + beanReader.getRowNumber()
                            + ":" + beanReader.getUntokenizedRow());

            csvProcessor.process(data);
        }
        return beanReader;
    }

    /**
     * 读取CSV数据，从classpath中读取
     */
    public static void loadCSVObjectList(final String dataType, final String csvFilename,
            final CsvListProcessor csvProcessor) {
        ICsvListReader listReader = null;
        try {
            final InputStream resourceAsStream = BaseFixtures.getCSvDataStream(csvFilename);
            listReader =
                    BaseFixtures.loadCSVObjectListFromStream(csvFilename, csvFilename, csvProcessor, resourceAsStream);
        } catch (final Exception e) {
            final String message =
                    "[" + dataType + "]数据加载解析失败。 @ " + csvFilename;
            BaseFixtures.log.warn(message, e);
        } finally {
            if (listReader != null) {
                try {
                    listReader.close();
                } catch (final IOException e) {
                }
            }
        }
    }

    /**
     * 读取临时旧数据，从本地文件路径读取
     */
    public static void loadTempCSVObjectList(final String dataType, final String csvFilename,
            final CsvListProcessor csvProcessor) {
        ICsvListReader listReader = null;
        try {
            final InputStream resourceAsStream = new FileInputStream("../data/" + csvFilename);
            listReader =
                    BaseFixtures.loadCSVObjectListFromStream(csvFilename, csvFilename, csvProcessor, resourceAsStream);
        } catch (final Exception e) {
            final String message =
                    "[" + dataType + "]数据加载解析失败。 @ " + csvFilename;
            BaseFixtures.log.warn(message, e);
        } finally {
            if (listReader != null) {
                try {
                    listReader.close();
                } catch (final IOException e) {
                }
            }
        }
    }

    private static ICsvListReader loadCSVObjectListFromStream(final String dataType, final String csvFilename,
            final CsvListProcessor csvProcessor,
            final InputStream resourceAsStream)
            throws IOException {
        ICsvListReader listReader = null;
        try {
            BaseFixtures.log.info("F" + Charset.defaultCharset().name());
            listReader = new CsvListReader(new InputStreamReader(resourceAsStream, "UTF-8"),
                    CsvPreference.STANDARD_PREFERENCE);
            // the header elements are used to map the values to the bean (names  must match)
            listReader.getHeader(true);

            List<Object> customerList;

            while ((customerList = listReader.read(csvProcessor.getProcessors())) != null) {
                csvProcessor.process(customerList);
            }
        } catch (final Exception e) {
            String message;
            if (listReader != null) {
                message =
                        "[" + dataType + "]数据加载解析失败，文件行号： " + listReader.getLineNumber() + ":"
                                + listReader.getRowNumber()
                                + ":" + listReader.getUntokenizedRow() + " @ " + csvFilename;
            } else {
                message =
                        "[" + dataType + "]数据加载解析失败。 @ " + csvFilename;
            }
            BaseFixtures.log.warn(message, e);
        } finally {
            if (listReader != null) {
                try {
                    listReader.close();
                } catch (final IOException e) {
                }
            }
        }
        return listReader;
    }
}
