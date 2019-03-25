/**
 * Created by wangwj on 2017/3/1.
 */
var LoginApp = angular.module("LoginApp", [
    "ngCookies",
    "ngMessages",
    "ngResource",
    "ngSanitize",
    "toastr"
]);

//通知消息全局配置
LoginApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        closeButton: true
    });
});

/* Setup global settings */
LoginApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: './assets',
        globalPath: './assets/global',
        layoutPath: './assets/layouts/layout'
    };
    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
LoginApp.controller('LoginController', ['$scope', '$rootScope', '$resource', '$window', 'toastr', function ($scope, $rootScope, $resource, $window, toastr) {
    $scope.$on('$viewContentLoaded', function () {
        App.initComponents(); // init core components
        Layout.init();
    });
    App.setAssetsPath('./assets/');

    $.backstretch([
            App.getAssetsPath() + "/pages/media/bg/1.jpg",
            App.getAssetsPath() + "/pages/media/bg/2.jpg",
            App.getAssetsPath() + "/pages/media/bg/3.jpg",
            App.getAssetsPath() + "/pages/media/bg/4.jpg"
        ], {
            fade: 1000,
            duration: 8000
        }
    );
    var loginUrl = "/login";
    var remember = $.cookie("remember");
    if (remember && remember == "true") {
        remember = true;
    } else {
        remember = false;
    }
    $scope.remember = remember || false;
    $scope.username = "";
    if ($scope.remember) {
        $scope.username = $.cookie("username") || "";
    }
    $scope.password = "";

    $scope.submit = function (form) {
        form.$submitted = true;
        if (form.$valid) {
            var param = {
                username: $scope.username,
                password: $scope.password
            };
            $resource(loginUrl, null, {'login': {method: 'GET'}}).login(param).$promise.then(function (result) {
                if ("success" == result.status) {
                    $.cookie("username", $scope.username, {'path': "/"});
                    var nickname = "";
                    if (result.data && result.data.details) {
                        nickname = result.data.details.username;
                    }
                    $.cookie("nickname", nickname, {'path': "/"});
                    $.cookie("remember", $scope.remember, {'path': "/"});
                    $window.location.href = "/index.html";
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "登录失败");
                    }
                }
            }, function (error) {
                toastr.error(error, "登录失败");
            });
        }
    }
}]);