package sample.bizfuse.web.fixtures.base;

import java.util.List;

import org.supercsv.cellprocessor.ift.CellProcessor;

public interface CsvListProcessor {
    public CellProcessor[] getProcessors();

    public void process(final List<Object> data);
}
