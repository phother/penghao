/**
 * Created by caoRN on 2016/11/18.
 * AngularFullCalendarDemoService
 */
(function (angular) {
    function AngularFullCalendarDemoService($resource, UrlConfigService) {
        this._getFullCalendarUrl = UrlConfigService.urlConfig.system.fullCalendar.fullCalendarUrl;
        //请求日程数据，初始化
        this.getFullCalendarData = function () {
            var resource = $resource(this._getFullCalendarUrl);
            return resource.get();
        };

        // 增、改、查日程请求调用函数
        this.FullCalendarDrag = function (model) {
            var resource = $resource(this._getFullCalendarUrl, {id: model.id, action: model.action});
            return resource.save(model);
        };

        // 删除事件
        this.FullCalendarDelete = function (id) {
            var resource = $resource(this._getFullCalendarUrl, {id: id});
            return resource.delete();
        };

    }

    AngularFullCalendarDemoService.prototype = new BaseListService().prototype;
    AngularFullCalendarDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('AngularFullCalendarDemoService', AngularFullCalendarDemoService);
})(angular);