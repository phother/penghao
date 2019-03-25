/***
 Metronic AngularJS App Main Script
 ***/
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "ui.validate",
    "oc.lazyLoad",
    "ngCookies",
    "ngMessages",
    "ngResource",
    "ngSanitize",
    "ngTouch",
    "toastr",
    "datePicker",
    "flow",
    "ngJsTree",
    "ng.ueditor",
    "ui.calendar"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
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
MetronicApp.controller('AppController', ['$scope', '$rootScope', 'AppCommonService', 'DictService', function ($scope, $rootScope, AppCommonService, DictService) {
    //检验登录
    AppCommonService.checkLogin();
    //加载动态码表数据
    DictService.loadDataFromServer();

    $scope.$on('$viewContentLoaded', function () {
        App.initComponents(); // init core components
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$rootScope', '$scope', '$window', 'AppCommonService', function ($rootScope, $scope, $window, AppCommonService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
    $scope.nickname = $.cookie("nickname") || "未知用户";
    $scope.logout = function () {
        AppCommonService.logout().$promise.then(function (result) {
            if ("success" == result.status) {
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() - 1);
                $.cookie("nickname", "", {'path': "/", 'expires': expireDate});
                $window.location.href = "/login.html";
            }
        });
    };
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$rootScope', '$scope', 'AppCommonService', function ($rootScope, $scope, AppCommonService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
    $scope.hasSubMenus = function (subMenus) {
        if (subMenus) {
            if (subMenus.length) {
                return true;
            }
        }
        return false;
    };
    $scope.initMenus = function () {
        AppCommonService.getMyAuthorizedMenus().$promise.then(function (result) {
            $rootScope.sidebarMenus = result.data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $rootScope.$broadcast("initMenuSuccess", true);
        });
    };

    $rootScope.$on("initMenuEvent", function (event, data) {
        $scope.initMenus();
    });
    $rootScope.$broadcast("initMenuEvent", true);
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);