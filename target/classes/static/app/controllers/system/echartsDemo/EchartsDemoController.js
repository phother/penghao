/**
 * Created by caorRN on 2016/11/10.
 * echarts示例
 */
angular.module('MetronicApp').controller('EchartsDemoController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EchartsDemoService',
        function ($rootScope, $scope, $location, toastr, EchartsDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            $scope.lineItem = [];
            $scope.lineData = [];
            EchartsDemoService.getEchartsLine().$promise.then(function (result) {
                if ('success' == result.status) {
                    angular.forEach(result.data, function (data) {
                        $scope.lineItem.push(data.num);
                        $scope.lineData.push(data.title);
                    });
                }
            });
            $scope.pieData = [];
            EchartsDemoService.getEchartsPie().$promise.then(function (result) {
                if ('success' == result.status) {
                    $scope.pieData = result.data;
                }
            })
        }]);
