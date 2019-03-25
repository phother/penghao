/**
 * 系统主页
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp").controller('DashController',
    ['$rootScope', '$scope',
        function ($rootScope, $scope) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            // set sidebar closed and body solid layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = true;
            $rootScope.settings.layout.pageSidebarClosed = false;
        }
    ]
);