/**
 * Created by wangwj on 2016/6/8.
 */
(function (angular) {
    function departmentService($resource, UrlConfigService) {
        var _schema = [
            {name: 'name', label: '部门名称', sortable: false},
            {name: 'description', label: '部门描述', sortable: false},
            {label: '操作', sortable: false, width: 220, type: 'template', templateUrl: 'operation.html'}
        ];
        var searchListUrl = UrlConfigService.urlConfig.system.department.searchListUrl;
        var url = UrlConfigService.urlConfig.system.department.url;
        BaseListService.call(this, searchListUrl, url, $resource, _schema);
        this._schema = _schema;
        this._sort = 'id';

    }

    departmentService.prototype = new BaseListService().prototype;
    departmentService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('departmentService', departmentService);
})(angular);
