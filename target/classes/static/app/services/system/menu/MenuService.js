/**
 * Created by wangwj on 2016/6/21.
 */
(function (angular) {
    function MenuService($resource, $q, $http, UrlConfigService) {
        this._schema = [
            {label: '菜单标题', sortable: false, type: 'template', templateUrl: "menuTitle.html"},
            {name: 'key', label: '菜单标识', sortable: false},
            {name: 'href', label: '跳转地址', sortable: false},
            {label: '菜单图标', sortable: false, type: 'template', templateUrl: "menuClass.html"},
            {label: '父菜单', sortable: false, type: 'template', templateUrl: "menuParent.html"},
            {name: 'sortNum', label: '排序位置', sortable: false},
            {label: '操作', sortable: false, width: 150, type: 'template', templateUrl: 'operation.html'}
        ];
        
        this._rootMenusUrl = UrlConfigService.urlConfig.system.menu.rootMenus;
        this._url = UrlConfigService.urlConfig.system.menu.url;
        this._subMenusUrl = UrlConfigService.urlConfig.system.menu.subMenus;
        this._menuTreeUrl = UrlConfigService.urlConfig.system.menu.menuTree;
        
        BaseListService.call(this, this._rootMenusUrl, this._url, $resource, this._schema);
        this._sort = '';
        this._order = '';


        //获取根菜单
        this.getRootMenus = function () {
            var service = this;
            var resource = $resource(this._rootMenusUrl);
            var queryMap = {};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)) {
                        if (this._s_search[k]) {
                            queryMap[k] = this._s_search[k];
                        }
                    }
                }
            }
            //queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };

        this.getSubMenus = function (parentId) {
            var service = this;
            var resource = $resource(this._subMenusUrl, {parentId: parentId});
            var queryMap = {};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k)) {
                        if (this._s_search[k]) {
                            queryMap[k] = this._s_search[k];
                        }
                    }
                }
            }
            //queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };

        this.getMenuTree = function () {
            var resource = $resource(this._menuTreeUrl);
            return resource.get();
        };
    }

    MenuService.prototype = Object.create(BaseListService.prototype);
    MenuService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('MenuService', MenuService);
})(angular);
