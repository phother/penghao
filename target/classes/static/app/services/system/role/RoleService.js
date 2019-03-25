/**
 * Created by wangwj on 2016/6/8.
 */
(function (angular) {
    function RoleService($resource, UrlConfigService) {
        var _schema = [
            {name: 'name', label: '角色名称', sortable: false},
            {name: 'description', label: '角色描述', sortable: false},
            {label: '操作', sortable: false, width: 220, type: 'template', templateUrl: 'operation.html'}
        ];
        var searchListUrl = UrlConfigService.urlConfig.system.role.searchListUrl;
        var url = UrlConfigService.urlConfig.system.role.url;
        BaseListService.call(this, searchListUrl, url, $resource, _schema);
        this._schema = _schema;
        this._sort = 'id';
        this._menuTreeUrl = UrlConfigService.urlConfig.system.menu.menuTree;
        this._roleMenuUrl = UrlConfigService.urlConfig.system.role.roleMenus;

        this.getMenuTree = function () {
            var resource = $resource(this._menuTreeUrl);
            return resource.get();
        };

        this.getRoleMenus = function (roleId) {
            var resource = $resource(this._roleMenuUrl, {roleId: roleId});
            return resource.get();
        };

        this.updateRoleMenus = function (roleMenus) {
            var resource = $resource(this._roleMenuUrl, {"roleId": roleMenus.id}, {'updateRoleMenus': {method: 'PUT'}});
            return resource.updateRoleMenus(roleMenus);
        };
    }

    RoleService.prototype = new BaseListService().prototype;
    RoleService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('RoleService', RoleService);
})(angular);
