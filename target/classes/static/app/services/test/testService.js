angular.module("MetronicApp").service("testService", ["$resource", "UrlConfigService", function ($resource, UrlConfigService) {
    this._enableUserUrl = UrlConfigService.urlConfig.system.platformUser.enable;
    this._disableUserUrl = UrlConfigService.urlConfig.system.platformUser.disable;
    this.enableUser = function (id) {
        var resource = $resource(this._enableUserUrl, {id: id}, {"enableUser": {"method": "PUT"}});
        return resource.enableUser();
    };

    this.disableUser = function (id) {
        var resource = $resource(this._disableUserUrl, {id: id}, {"disableUser": {"method": "PUT"}});
        return resource.disableUser();
    };
}])