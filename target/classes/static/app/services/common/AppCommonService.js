/**
 * Created by wangwj on 2016/6/23.
 */
angular.module("MetronicApp").service('AppCommonService',
    ['$resource', 'UrlConfigService',
        function ($resource, UrlConfigService) {
            this._myMenusUrl = UrlConfigService.urlConfig.appCommon.authorizations.myMenus;
            this._checkLoginUrl = UrlConfigService.urlConfig.appCommon.login.checkLogin;
            this._logoutUrl = UrlConfigService.urlConfig.appCommon.login.logout;

            this.getMyAuthorizedMenus = function () {
                var resource = $resource(this._myMenusUrl);
                return resource.get();
            };

            this.checkLogin = function () {
                var resource = $resource(this._checkLoginUrl);
                return resource.get();
            };

            this.logout = function () {
                var resource = $resource(this._logoutUrl);
                return resource.save();
            }
        }
    ]
);
