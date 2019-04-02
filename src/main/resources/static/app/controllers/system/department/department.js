/**
 * Created by wangwj on 2016/6/6.
 */
angular.module("MetronicApp").controller('departmentListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'departmentService',
        function ($rootScope, $scope, $location, $uibModal, toastr, departmentService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //ng-table about
            $scope.columns = departmentService.getSchema();
            $scope.sort = departmentService.getSort();
            $scope.order = departmentService.getOrder();
            $scope.pageable = departmentService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                departmentService.list().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    departmentService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                departmentService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            $scope.condition = {};
            departmentService.clearSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                departmentService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                departmentService.setStoredPage(newVal - 1);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                departmentService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                departmentService.setOrder(newValue);
                $scope.list();
            });

            $scope.create = function () {
                $location.path("/system/department/create.html").search({});
            };

            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/system/department/view.html").search({"id": id});
            };

            $scope.edit = function (id) {
                $location.path("/system/department/edit.html").search({"id": id});
            };

            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除该角色吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    departmentService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            gotoFirstPage();
                            toastr.success("", "角色删除成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "角色删除失败");
                            }
                        }
                    });
                });
            };

        }
    ]
).controller('departmentEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', 'departmentService',
        function ($rootScope, $scope, $location, toastr, EnumService, departmentService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            if ($scope.id) {
                //编辑
                departmentService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "角色信息获取失败");
                        }
                    }
                });
            } else {
                //新建
                $scope.model = {};
                $scope.copy_model = angular.copy($scope.model);
            }

            $scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    departmentService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "部门信息保存成功");
                            $location.path("/system/department/list.html").search({});
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "部门信息保存失败");
                            }
                        }
                    });
                }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/system/department/list.html").search({});
            };
        }
    ]
)