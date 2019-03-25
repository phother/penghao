/**
 * Created by lijing on 2016/6/7.
 */
(function (angular) {
    function PlatformUserService($resource, UrlConfigService) {
        this._schema = [
            {type: "checkbox", sortable: false},
            {name: 'loginId', label: '登录名', sortable: true},
            {name: 'name', label: '姓名', sortable: true},
            {name: 'birthday', label: '生日', sortable: false, filter: "date"},
            {name: 'gender', label: '性别', sortable: false, filter: "genderFilter"},
            {name: 'createdDate', label: '创建时间', sortable: true, filter: "timestampToTime"},
            {name: 'roleNamesList', label: '角色名', sortable: false, filter: "roleNamesFilter"},
            {name: 'enabled', label: '状态', sortable: true, filter: "platformFilter"},
            {label: '操作', sortable: false, width: 240, type: 'template', templateUrl: 'operation.html'}
        ];
        this._searchListUrl = UrlConfigService.urlConfig.system.platformUser.searchListUrl;
        this._url = UrlConfigService.urlConfig.system.platformUser.url;
        this._enableUserUrl = UrlConfigService.urlConfig.system.platformUser.enable;
        this._disableUserUrl = UrlConfigService.urlConfig.system.platformUser.disable;
        this._changePasswordUrl = UrlConfigService.urlConfig.system.platformUser.changePasswordUrl;
        this._getPlatformUserRolesUrl = UrlConfigService.urlConfig.system.role.url;

        this._sort = 'name';
        this._order = 'asc';

        BaseListService.call(this, this._searchListUrl, this._url, $resource, this._schema);

        this.enableUser = function (id) {
            var resource = $resource(this._enableUserUrl, {id: id}, {"enableUser": {"method": "PUT"}});
            return resource.enableUser();
        };

        this.disableUser = function (id) {
            var resource = $resource(this._disableUserUrl, {id: id}, {"disableUser": {"method": "PUT"}});
            return resource.disableUser();
        };

        this.changePassword = function (id, model) {
            var resource = $resource(this._changePasswordUrl, {id: id}, {"changePassword": {"method": "PUT"}});
            return resource.changePassword(model);
        };

        this.getAllRoles = function () {
            var resource = $resource(this._getPlatformUserRolesUrl);
            return resource.get();
        };
    }

    PlatformUserService.prototype = new BaseListService().prototype;
    PlatformUserService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('PlatformUserService', PlatformUserService);
})(angular);

