/**
 * Created by caoRN on 2016/11/10.
 * echarts示例
 */
(function (angular) {
    function EchartsDemoService($resource, UrlConfigService) {
        this._schema = [];

        this._searchListUrl = UrlConfigService.urlConfig.system.platformUser.searchListUrl;//列表页面
        this._url = UrlConfigService.urlConfig.system.platformUser.url;//详细页面id

        BaseListService.call(this._searchListUrl, this._url, $resource, this._schema);

        this._echartsLineUrl = UrlConfigService.urlConfig.system.echartsDemo.echartsLineUrl;
        this._echartsPieUrl = UrlConfigService.urlConfig.system.echartsDemo.echartsPieUrl;

        this.getEchartsLine = function () {
            return $resource(this._echartsLineUrl).get();
        }
        this.getEchartsPie = function () {
            return $resource(this._echartsPieUrl).get();
        }
    }

    EchartsDemoService.prototype = new BaseListService().prototype;
    EchartsDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('EchartsDemoService', EchartsDemoService);
})(angular);