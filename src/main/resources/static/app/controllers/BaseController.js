/**
 * Created by Administrator on 2017/2/20 0020.
 */
angular.module('MetronicApp').controller("BaseController",
    ["$rootScope", "$scope", "$location", "testParentService", "$uibModal", "toastr",
        function ($rootScope, $scope, $location, testParentService, $uibModal, toastr) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.hasInitData = true;
            $scope.selectable = false;
            $scope.notpageable = false;

            $scope.url = "/w/" + $scope.options.module;
            $scope.modeule = $scope.options.module;
            $scope.serviceName = $scope.options.service;
            $scope.columns = $scope.options.schema;
                if (false == $scope.options.hasInitData) {
                $scope.hasInitData = $scope.options.hasInitData;
            }
            if ($scope.options.selectable) {
                $scope.selectable = $scope.options.selectable;
            }
            if ($scope.options.notpageable) {
                $scope.notpageable = $scope.options.notpageable;
            }

            //search
            $scope.search = function () {
                if ($scope.options.searchParams) {
                    testParentService.putSearchParams($scope.options.searchParams);
                } else {
                    testParentService.putSearchParams({});
                }

                $scope.gotoFirstPage();
            };
            //method of fetch list data
            $scope.list = function () {
                if ($scope.url) {
                    testParentService.list($scope.url + "/s").$promise.then(function (result) {
                        $scope.rows = result.data;
                        //storage page state
                        testParentService.setStoredPage(result.pageable.number);
                        $scope.pageable = result.pageable;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }
            };
            $scope.view = function (id) {
                $location.path("/root/" + $scope.modeule + "/view.html").search({"id": id});
            };
            $scope.edit = function (id) {
                $location.path("/root/" + $scope.modeule + "/edit.html").search({"id": id});
            };

            $scope.gotoFirstPage = function () {
                testParentService.setSize(10);
                testParentService.setStoredPage(0);
                $scope.list();
            };
            //start to fetch list data
            testParentService.clearSearchParams();
            if ($scope.hasInitData) {
                $scope.gotoFirstPage();
            }

            $scope.changeStatusModal = function (row, obj) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", $scope.serviceName, function (scope, $uibModalInstance, service) {
                        scope.confirmContent = obj.content;
                        scope.btn_ok = function () {
                            service[obj.functionName](row.id).$promise.then(function (result) {
                                if ("success" == result.status) {
                                    toastr.success("", "更改状态成功。");
                                } else {
                                    for (var index in result.errors) {
                                        toastr.error(result.errors[index].errmsg, "更改状态失败");
                                    }
                                }
                            });
                            $uibModalInstance.dismiss();
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
            };

            $scope.deleteModal = function (row, obj) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", "testParentService", function (scope, $uibModalInstance, service) {
                        scope.confirmContent = obj.content;
                        scope.btn_ok = function () {
                            service.delete($scope.url ,row.id).$promise.then(function (result) {
                                if ("success" == result.status) {
                                    toastr.success("", "删除成功。");
                                } else {
                                    for (var index in result.errors) {
                                        toastr.error(result.errors[index].errmsg, "删除失败");
                                    }
                                }
                            });
                            $uibModalInstance.dismiss();
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });
            };

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                testParentService.setSize(newVal);
                $scope.gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                testParentService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                testParentService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                testParentService.setOrder(newValue);
                $scope.list();
            });
            //ng-table about
            $scope.sort = testParentService.getSort();
            $scope.order = testParentService.getOrder();
            $scope.pageable = testParentService.getPageable();
        }])
    .controller('formController',
        ['$rootScope', '$scope', '$location', 'EnumService', 'testParentService', 'toastr',
            function ($rootScope, $scope, $location, EnumService, testParentService, toastr) {
                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });
                $scope.id = $location.search().id;
                $scope.module = $scope.options.module;
                if ($scope.id) {
                    //编辑
                    var url = "/w/" + $scope.module + "/:id";
                    testParentService.get(url, $scope.id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            $scope.model = result.data;
                            $scope.copy_model = angular.copy($scope.model);
                        } else {
                            for (var index in result.errors) {
                                toastr.error("平台用户信息获取失败，", result.errors[index].errmsg);
                            }
                        }
                    });
                } else {
                    //新建
                    $scope.model = {};
                    $scope.model.disabled = false;
                    $scope.copy_model = angular.copy($scope.model);
                }

                $scope.submit = function (form) {
                    form.$submitted = true;
                    if (form.$valid) {
                        var url = "/w/" + $scope.module + "/:id";
                        testParentService.save(url, $scope.model).$promise.then(function (result) {
                            if ("success" == result.status) {
                                toastr.success("", "平台用户信息保存成功");
                                $location.path("/root/" + $scope.module + "/list.html").search({});
                            } else {
                                for (var index in result.errors) {
                                    toastr.error(result.errors[index].errmsg, "平台用户信息保存失败");
                                }
                            }
                        });
                    }
                };

                $scope.reset = function () {
                    $scope.model = angular.copy($scope.copy_model);
                };

                $scope.back = function () {
                    $location.path("/root/" + $scope.module + "/list.html").search({});
                };
            }
        ]
    );