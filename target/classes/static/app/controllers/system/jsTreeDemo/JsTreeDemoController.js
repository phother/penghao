/**
 * Created by caoRN on 2016/11/9.
 */
angular.module('MetronicApp').controller('JsTreeDemoController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'JsTreeDemoService',
        function ($rootScope, $scope, $location, $uibModal, toastr, JsTreeDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            $scope.columns = JsTreeDemoService.getSchema();
            $scope.sort = JsTreeDemoService.getSort();
            $scope.order = JsTreeDemoService.getOrder();
            $scope.pageable = JsTreeDemoService.getPageable();
            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                JsTreeDemoService.setSize(newVal);
                gotoFirstPage();
            });
            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                JsTreeDemoService.setStoredPage(newVal);
                $scope.list();
            });
            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                JsTreeDemoService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                JsTreeDemoService.setOrder(newValue);
                $scope.list();
            });

            $scope.list = function () {
                JsTreeDemoService.list().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.rows = result.data;
                    }
                    JsTreeDemoService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                })
            };
            var gotoFirstPage = function () {
                JsTreeDemoService.setStoredPage(0);
                $scope.list();
            };
            JsTreeDemoService.clearSearchParams();
            gotoFirstPage();


        }]).filter('genderFilter', function () {
    return function (value) {
        if ('male' == value) {
            return '男';
        } else {
            return '女';
        }
    }
});
angular.module('MetronicApp').controller('treeCtrl',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', '$timeout', 'JsTreeDemoService',
        function ($rootScope, $scope, $location, $uibModal, toastr, $timeout, JsTreeDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            $scope.ignoreChanges = false;//用于jstree数据的动态监听
            JsTreeDemoService.getMenuTree().$promise.then(function (result) {
                if ('success' == result.status) {
                    $scope.ignoreChanges = true;
                    $scope.treeData = result.data;//树的ng-model数据的双向绑定
                    $scope.treeConfig.version++;//递增版本
                }
            });
            //tree的配置项
            $scope.treeConfig = {
                core: {
                    multiple: true,
                    animation: true,
                    error: function (error) {
                        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true
                },
                types: {
                    default: {
                        icon: 'glyphicon glyphicon-folder-open'
                    },
                    star: {
                        icon: 'glyphicon glyphicon-star'
                    },
                    cloud: {
                        icon: 'glyphicon glyphicon-cloud'
                    }
                },
                version: 1,
                plugins: ['types', 'checkbox']
            };
            //树加载完成事件
            $scope.readyCB = function () {
                $scope.treeInstance.jstree(true).open_all();//加载完成默然打开全部节点
            };
            //树选中事件
            $scope.selectCB = function (e, item) {
                $scope.selectnode = $scope.treeInstance.jstree(true).get_selected('true')[0];//当前选中的node节点
                console.log($scope.selectnode);
            };
            //监听change事件
            $scope.applyModelChanges = function () {
                return !$scope.ignoreChanges;
            };
        }]);
