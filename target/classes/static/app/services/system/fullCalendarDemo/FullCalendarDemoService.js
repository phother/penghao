/**
 * Created by caoRN on 2016/11/16.
 * FullCalendarDemoService
 */
(function (angular) {
    function FullCalendarDemoService($resource, UrlConfigService) {

        this._getFullCalendarUrl = UrlConfigService.urlConfig.system.fullCalendar.fullCalendarUrl;
        //请求日程数据，初始化
        this.getFullCalendarData = function () {
            var resource = $resource(this._getFullCalendarUrl);
            return resource.get();
        };

        // 增、改、查日程请求调用函数
        this.FullCalendarDrag = function (model) {
            var resource = $resource(this._getFullCalendarUrl, {action: model.action});
            return resource.save(model);
        };

        // 删除事件
        this.FullCalendarDelete = function (id) {
            var resource = $resource(this._getFullCalendarUrl, {id: id});
            return resource.delete();
        };

    }

    FullCalendarDemoService.prototype = new BaseListService().prototype;
    FullCalendarDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('FullCalendarDemoService', FullCalendarDemoService)
})(angular);