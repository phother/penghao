/**
 * 拦截器处理配置
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp").config(['$httpProvider', function ($httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    // Disable IE ajax request caching 禁用IE缓存Ajax请求
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';//头域设置，指示请求或响应消息不能缓存
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';//同上

    var _requestQueue = [];

    $httpProvider.interceptors.push(['$rootScope', '$q', '$window', 'toastr', function ($rootScope, $q, $window, toastr) {
        return {
            'request': function (config) {
                if (config.url.indexOf('/w/') >= 0) {
                    _requestQueue.push(config.url);
                    $rootScope.$broadcast("dataRequestStart", true);
                }
                return config || $q.when(config);
            },
            'requestError': function (rejection) {
                console.log("requestError", rejection);
                return rejection;
            },
            //success -> don't intercept
            'response': function (response) {
                if (response.config.url.indexOf('/w/') >= 0) {
                    var idx = _requestQueue.indexOf(response.config.url);
                    if (idx >= 0) {
                        _requestQueue.splice(idx, 1);
                    }
                    if (_requestQueue.length == 0) {
                        $rootScope.$broadcast("dataRequestEnd", true);
                    }
                }
                return response || $q.when(response);
            },
            //error -> if 401 save the request and broadcast an event
            'responseError': function (response) {
                if (response && response.config) {
                    if (response.config.url.indexOf('/w/') >= 0) {
                        var idx = _requestQueue.indexOf(response.config.url);
                        if (idx >= 0) {
                            _requestQueue.splice(idx, 1);
                        }
                        if (_requestQueue.length == 0) {
                            $rootScope.$broadcast("dataRequestEnd", true);
                        }
                    }
                    if (response.status === 400) {
                        toastr.error("", "请求传递参数不正确！");
                    } else if (response.status === 401) {
                        $window.location.href = "/login.html";
                    } else if (response.status === 403) {
                        $window.location.href = "/login.html";
                    } else if (response.status === 404) {
                        toastr.error("", "你请求的资源未找到");
                    } else if (response.status === 500) {
                        toastr.error("", "服务异常");
                    } else {
                        toastr.error(response.status, "其他异常！");
                    }
                } else {
                    _requestQueue = [];
                    $rootScope.$broadcast("dataRequestEnd", true);
                }
                return $q.reject(response);
            }
        };
    }]);
}]);
