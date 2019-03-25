/**
 *
 * Created by wangwj on 2016/6/7.
 */
angular.module("MetronicApp").controller('DictionaryCategoryListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'DictionaryCategoryService',
        function ($rootScope, $scope, $location, $uibModal, toastr, DictionaryCategoryService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //ng-table about
            $scope.columns = DictionaryCategoryService.getSchema();
            $scope.sort = DictionaryCategoryService.getSort();
            $scope.order = DictionaryCategoryService.getOrder();
            $scope.pageable = DictionaryCategoryService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                DictionaryCategoryService.list().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    DictionaryCategoryService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                DictionaryCategoryService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            $scope.condition = {};
            DictionaryCategoryService.clearSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DictionaryCategoryService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DictionaryCategoryService.setStoredPage(newVal - 1);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DictionaryCategoryService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DictionaryCategoryService.setOrder(newValue);
                $scope.list();
            });

            $scope.create = function () {
                $location.path("/system/dictionary/category/create.html").search({});
            };

            //search
            $scope.search = function () {
                DictionaryCategoryService.putSearchParams(
                    {
                        key: $scope.condition.key
                    }
                );
                gotoFirstPage();
            };

            $scope.edit = function (id) {
                $location.path("/system/dictionary/category/edit.html").search({"id": id});
            };

            $scope.view = function (id) {
                $location.path("/system/dictionary/category/view.html").search({"id": id});
            };

            //查看代码
            $scope.viewCodeType = function (row) {
                $location.path("/system/dictionary/code/list.html").search({categoryId: row.id, categoryKey: row.key});
            };

            $scope.discard = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确定要废弃此代码类型么？如废弃则不能再次启用！";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(row.id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    DictionaryCategoryService.discard(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            row.discarded = true;
                            toastr.success("", "代码类型废弃成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error("代码类型废弃失败，", result.errors[index].errmsg);
                            }
                        }
                    });
                });
            };
        }
    ]
).controller('DictionaryCategoryEditController',
    ['$rootScope', '$scope', '$location', "toastr", 'DictionaryCategoryService',
        function ($rootScope, $scope, $location, toastr, DictionaryCategoryService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            if ($scope.id) {
                //编辑
                DictionaryCategoryService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error("码表类型信息获取失败，", result.errors[index].errmsg);
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
                    if ($scope.id) {
                        DictionaryCategoryService.save($scope.model).$promise.then(function (result) {
                            if ("success" == result.status) {
                                toastr.success("", "码表类型信息修改成功");
                                $location.path("/system/dictionary/category/list.html").search({});
                            } else {
                                for (var index in result.errors) {
                                    toastr.error("码表类型信息保存失败，", result.errors[index].errmsg);
                                }
                            }
                        });
                    } else {
                        DictionaryCategoryService.save($scope.model).$promise.then(function (result) {
                            if ("success" == result.status) {
                                toastr.success("", "码表类型信息保存成功");
                                $location.path("/system/dictionary/category/list.html").search({});
                            } else {
                                for (var index in result.errors) {
                                    toastr.error("码表类型保存失败", result.errors[index].errmsg);
                                }
                            }
                        });
                    }
                }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/system/dictionary/category/list.html").search({});
            };

        }
    ]
).controller('DictionaryCategoryViewController',
    ['$rootScope', '$scope', '$location', "toastr", 'DictionaryCategoryService',
        function ($rootScope, $scope, $location, toastr, DictionaryCategoryService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            if ($scope.id) {
                //编辑
                DictionaryCategoryService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                    } else {
                        for (var index in result.errors) {
                            toastr.error("码表类型信息获取失败，", result.errors[index].errmsg);
                        }
                    }
                });
            } else {
                toastr.error("", "未找到资源ID");
            }

            $scope.back = function () {
                $location.path("/system/dictionary/category/list.html").search({});
            };
        }
    ]
).filter("discardedFilter", function () {
    return function (value) {
        if (value) {
            return "已废弃";
        } else {
            return "使用中";
        }
    };
});