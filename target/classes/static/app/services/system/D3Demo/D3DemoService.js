/**
 * Created by caoRN on 2016/11/22.
 * D3DemoService
 */
(function () {
    function D3DemoService($resource, UrlConfigService) {
        this._getD3DemoData = UrlConfigService.urlConfig.system.D3Demo.url;
        this.getD3DemoData = function () {
            var resource = $resource(this._getD3DemoData);
            return resource.get();
        }
    }

    D3DemoService.prototype = new BaseListService().prototype;
    D3DemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('D3DemoService', D3DemoService);
})(angular);