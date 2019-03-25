/**
 * Created by caoRN on 2016/11/18.
 * JsPlumbDemoService
 */
(function (angular) {
    function JsPlumbDemoService($resource, UrlConfigService) {

        this._getDataUrl = UrlConfigService.urlConfig.system.dashboard.url;
        this.getData = function (id) {
            var resource = $resource(this._getDataUrl, {"id": id}, {"getData": {"method": "GET"}});
            return resource.getData();
        };

        this._saveUrl = UrlConfigService.urlConfig.system.dashboard.url;
        this.save = function (model) {
            if (undefined !== model.id) {
                return $resource(this._saveUrl, {id: model.id}, {'update': {method: 'PUT'}}).update({id: model.id}, model);
            } else {
                return $resource(this._saveUrl).save(model);
            }
        };
    }

    JsPlumbDemoService.prototype = new BaseListService().prototype;
    JsPlumbDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('JsPlumbDemoService', JsPlumbDemoService);
})(angular);