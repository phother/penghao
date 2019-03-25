/**
 * Created by caoRN on 2016/11/11.
 * ueditorDemo
 */
(function (angular) {
    function UEditorDemoService($resource, UrlConfigService) {
        this._schema = [];

        this._searchListUrl = UrlConfigService.urlConfig.system.platformUser.searchListUrl;//列表页面
        this._url = UrlConfigService.urlConfig.system.platformUser.url;//详细页面id

        BaseListService.call(this._searchListUrl, this._url, $resource, this._schema);

        this._UEditorUrl = UrlConfigService.urlConfig.system.UEditor.UEditorUrl;

        this.getUEditorData = function () {
            var resource = $resource(this._UEditorUrl);
            return resource.get();
        }

    }

    UEditorDemoService.prototype = new BaseListService().prototype;
    UEditorDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('UEditorDemoService', UEditorDemoService);
})(angular);