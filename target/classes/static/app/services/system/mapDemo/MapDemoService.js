/**
 * Created by caoRN on 2016/11/15.
 * MapDemoService
 */
(function (angular) {
    function MapDemoService($resource, UrlConfigService) {

    }

    MapDemoService.prototype = new BaseListService().prototype;
    MapDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('MapDemoService', MapDemoService);
})(angular);
