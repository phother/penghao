/**
 * 动态数据存储服务
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp")
    .service('DictService', ['$rootScope', '$resource', '$window', 'UrlConfigService', 'toastr',
        function ($rootScope, $resource, $window, UrlConfigService, toastr) {

            this._apiUrl = UrlConfigService.urlConfig.dataDictionary.url;

            this._dataDictionaryStorage = new Map();

            this._haveLocalStorage = $window.localStorage;

            this.get = function (key) {
                if (this._dataDictionaryStorage.isEmpty()) {
                    this.loadDataFromCacheOrServer();
                }
                return this._dataDictionaryStorage.get(key);
            };

            this.loadDataFromCacheOrServer = function (serverData) {
                var service = this;
                if (serverData) {
                    for (var name in serverData) {
                        service._dataDictionaryStorage.put(name, serverData[name]);
                    }
                } else {
                    if (service._haveLocalStorage) {
                        var dataDictionaryData = angular.fromJson($window.localStorage.getItem("dataDictionaryData"));
                        if (dataDictionaryData) {
                            for (var name in dataDictionaryData.data) {
                                service._dataDictionaryStorage.put(name, dataDictionaryData.data[name]);
                            }
                        }
                    } else {
                        //不支持localStorage，而且service无数据
                        toastr.error("", "数据丢失，请重新刷新页面！");
                    }
                }
            };

            this.loadDataFromServer = function () {
                var service = this;
                var url = service._apiUrl;
                var param = null;
                if (service._haveLocalStorage) {
                    var data = $window.localStorage.getItem("dataDictionaryData");
                    if (data && data.length != 0) {
                        var timestamp = angular.fromJson(data).timestamp;
                        param = {
                            t: timestamp
                        };
                    }
                }

                var resource = $resource(this._apiUrl);

                resource.get(param).$promise.then(function (result) {
                    if (result.status === 'success') {
                        if (typeof result.data === "object" && !(result.data instanceof Array)) {
                            var hasProp = false;
                            for (var prop in result.data) {
                                hasProp = true;
                                break;
                            }
                            if (hasProp) {
                                var dataDictionaryData = {
                                    "timestamp": result.timestamp,
                                    "data": result.data
                                };
                                if (service._haveLocalStorage) {
                                    $window.localStorage.setItem("dataDictionaryData", JSON.stringify(dataDictionaryData));
                                    service.loadDataFromCacheOrServer();
                                } else {
                                    service.loadDataFromCacheOrServer(result.data);
                                }
                                $rootScope.$broadcast("dictAvailableEvent", true);
                            }
                        } else {
                            toastr.error("", "获取数据字典格式错误！");
                        }
                    } else {
                        var msg = result.errors[0].errmsg;
                        toastr.error("", msg);
                    }
                });
            };
        }]);