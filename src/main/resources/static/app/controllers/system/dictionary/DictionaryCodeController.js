/**
 * Created by wangwj on 2016/6/7.
 */
angular.module("MetronicApp").controller('DictionaryCodeListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'DictionaryCodeService',
        function ($rootScope, $scope, $location, $uibModal, toastr, DictionaryCodeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.back = function () {
                $location.path("/system/dictionary/category/list.html").search({});
            };

            $scope.categoryId = $location.search().categoryId;
            $scope.categoryKey = $location.search().categoryKey;

            //ng-table about
            $scope.columns = DictionaryCodeService.getSchema();
            $scope.sort = DictionaryCodeService.getSort();
            $scope.order = DictionaryCodeService.getOrder();
            $scope.pageable = DictionaryCodeService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                DictionaryCodeService.list($scope.categoryId).$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    DictionaryCodeService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                DictionaryCodeService.setStoredPage(0);
                $scope.list();
            };
            DictionaryCodeService.getCodeByCategoryId($scope.categoryId).$promise.then(function (result) {
                if ("success" == result.status) {
                    DictionaryCodeService.setParentCodes(result.data);
                    //$scope.categoryCodes = result.data;
                }
                //start to fetch list data
                $scope.condition = {};
                DictionaryCodeService.clearSearchParams();
                gotoFirstPage();
            });

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DictionaryCodeService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                DictionaryCodeService.setStoredPage(newVal - 1);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DictionaryCodeService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                DictionaryCodeService.setOrder(newValue);
                $scope.list();
            });

            $scope.create = function () {
                $location.path("/system/dictionary/code/create.html").search({
                    "categoryId": $scope.categoryId,
                    "categoryKey": $scope.categoryKey
                });
            };

            //search
            $scope.search = function () {
                DictionaryCodeService.putSearchParams(
                    {
                        key: $scope.condition.key,
                        discarded: $scope.condition.discarded
                    }
                );
                gotoFirstPage();
            };

            $scope.edit = function (id) {
                $location.path("/system/dictionary/code/edit.html").search({
                    "categoryId": $scope.categoryId,
                    "categoryKey": $scope.categoryKey,
                    "id": id
                });
            };

            $scope.view = function (id) {
                $location.path("/system/dictionary/code/view.html").search({
                    "categoryId": $scope.categoryId,
                    "categoryKey": $scope.categoryKey,
                    "id": id
                });
            };

            $scope.moveUp = function (id) {
                DictionaryCodeService.moveUp(id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        toastr.success("", "代码上移成功。");
                        $scope.list();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "代码上移失败");
                        }
                    }
                });
            };

            $scope.moveDown = function (id) {
                DictionaryCodeService.moveDown(id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        toastr.success("", "代码下移成功。");
                        $scope.list();
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "代码下移失败");
                        }
                    }
                });
            };

            $scope.discard = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确定要废弃此代码吗？如废弃则不能再次启用！";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(row.id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    DictionaryCodeService.discard(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            row.discarded = true;
                            toastr.success("", "代码废弃成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error("代码废弃失败，", result.errors[index].errmsg);
                            }
                        }
                    });
                });
            };
        }
    ]
).controller('DictionaryCodeEditController',
    ['$rootScope', '$scope', '$location', "$state", "toastr", 'DictionaryCodeService',
        function ($rootScope, $scope, $location, $state, toastr, DictionaryCodeService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.categoryId = $location.search().categoryId;
            $scope.categoryKey = $location.search().categoryKey;

            //修复导航跳转问题
            if ($scope.categoryId && $scope.categoryKey) {
                var codeListPageBarHref = $state.current.data.pageBar[2].href;
                var fixHref = "?categoryId=" + $scope.categoryId + "&categoryKey=" + $scope.categoryKey;
                if (codeListPageBarHref.indexOf(fixHref) == -1) {
                    if (codeListPageBarHref.lastIndexOf("?") == -1) {
                        $state.current.data.pageBar[2].href = codeListPageBarHref + fixHref;
                    } else {
                        $state.current.data.pageBar[2].href = codeListPageBarHref.substr(0, codeListPageBarHref.lastIndexOf("?")) + fixHref;
                    }

                }
            }

            DictionaryCodeService.getCodeByCategoryId($scope.categoryId).$promise.then(function (result) {
                var categoryCodes = result.data;
                //编辑
                if ($scope.id) {
                    //获取当前code数据
                    DictionaryCodeService.get($scope.id).$promise.then(function (result) {
                        $scope.model = result.data;
                        var newCategoryCodes = [];
                        for (var index in categoryCodes) {
                            if ($scope.model.id != categoryCodes[index].id) {
                                newCategoryCodes.push(categoryCodes[index]);
                            }
                        }
                        $scope.parentCodes = newCategoryCodes;
                        $scope.model.categoryKey = $scope.categoryKey;
                        $scope.model.categoryId = $scope.categoryId;
                        //获取初始状态信息，为重置做准备
                        $scope.copy_model = angular.copy($scope.model);

                    });
                    //新增
                } else {
                    //新建
                    $scope.model = {
                        categoryId: $scope.categoryId,
                        categoryKey: $scope.categoryKey,
                        parentId: undefined,
                        editable: true
                    };
                    $scope.parentCodes = categoryCodes;
                    $scope.copy_model = angular.copy($scope.model);
                }
            });

            $scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    DictionaryCodeService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "码表代码信息保存成功");
                            $location.path("/system/dictionary/code/list.html").search({
                                "categoryId": $scope.categoryId,
                                "categoryKey": $scope.categoryKey
                            });
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "码表代码信息保存失败");
                            }
                        }
                    });
                }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/system/dictionary/code/list.html").search({
                    "categoryId": $scope.categoryId,
                    "categoryKey": $scope.categoryKey
                });
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
}).filter("editableFilter", function () {
    return function (value) {
        if (value) {
            return "是";
        } else {
            return "否";
        }
    };
}).filter("parentFilter", ["DictionaryCodeService", function (DictionaryCodeService) {
    return function (value) {
        var parentCodes = DictionaryCodeService.getParentCodes();
        var even = _.find(parentCodes, function (parentCode) {
                return parentCode.id == value;
            }
        );
        return even ? even.text : "";
    };
}]);