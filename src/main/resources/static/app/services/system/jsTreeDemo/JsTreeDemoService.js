/**
 * Created by caoRN on 2016/11/9.
 */
(function (angular) {
    function JsTreeDemoService($resource, UrlConfigService) {
        this._schema = [
            {name: 'userName', label: '用户名', sortable: true},
            {name: 'nickName', label: '名称', sortable: true},
            {name: 'age', label: '年龄', sortable: true},
            {name: 'gender', label: '性别', sortable: true, filter: "genderFilter"},
            {name: 'createDate', label: '创建时间', sortable: true, filter: "timestampToTime"}
        ];
        this._searchListUrl = UrlConfigService.urlConfig.system.platformUser.searchListUrl;//列表页面
        this._url = UrlConfigService.urlConfig.system.platformUser.url;//详细页面id
        this._menuTreeUrl = UrlConfigService.urlConfig.system.menu.menuTree;

        BaseListService.call(this, this._searchListUrl, this._url, $resource, this._schema);//改变上下文参数


        this.getMenuTree = function () {
            var resource = $resource(this._menuTreeUrl);
            return resource.get();
        };
    }

    JsTreeDemoService.prototype = new BaseListService().prototype;
    JsTreeDemoService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('JsTreeDemoService', JsTreeDemoService);
})(angular);
