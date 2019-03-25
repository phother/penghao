/**
 * Created by wangwj on 2016/6/21.
 */
angular.module("MetronicApp").controller('MenuListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'MenuService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MenuService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //ng-table about
            $scope.columns = MenuService.getSchema();
            $scope.sort = MenuService.getSort();
            $scope.order = MenuService.getOrder();
            $scope.pageable = MenuService.getPageable();
            $scope.notpageable = true;

            var initPage = function () {
                if ($scope.parentMenuId) {
                    $scope.backButtonShow = true;
                    MenuService.getSubMenus($scope.parentMenuId).$promise.then(function (result) {
                        $scope.rows = result.data;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                } else {
                    $scope.backButtonShow = false;
                    MenuService.getRootMenus().$promise.then(function (result) {
                        $scope.rows = result.data;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }

            };

            //search
            $scope.search = function () {
                MenuService.putSearchParams(
                    {
                        query: $scope.condition.query
                    }
                );
                initPage();
            };

            initPage();

            $scope.viewChildrenMenu = function (row) {
                $scope.condition = {};
                MenuService.clearSearchParams();
                $scope.backParentMenuId = $scope.parentMenuId;
                $scope.parentMenuId = row.id;
                initPage();
            };

            $scope.back = function (backParentMenuId) {
                $scope.condition = {};
                MenuService.clearSearchParams();
                if (backParentMenuId) {
                    MenuService.get(backParentMenuId).$promise.then(function (result) {
                        if (result.status == "success") {
                            $scope.parentMenuId = $scope.backParentMenuId;
                            $scope.backParentMenuId = result.data.parentId;
                            initPage();
                        }
                    });
                } else {
                    $scope.parentMenuId = $scope.backParentMenuId;
                    $scope.backParentMenuId = undefined;
                    initPage();
                }
            };

            $scope.$watch('sort', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                MenuService.setSort(newValue);
                initPage();
            });

            $scope.$watch('order', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                MenuService.setOrder(newValue);
                initPage();
            });

            $scope.create = function () {
                $location.path("/system/menu/create.html").search({});
            };

            $scope.edit = function (id) {
                $location.path("/system/menu/edit.html").search({id: id});
            };

            $scope.view = function (id) {
                $location.path("/system/menu/view.html").search({id: id});
            };

            $scope.delete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认删除该菜单吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    MenuService.delete(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            $rootScope.$broadcast("initMenuEvent", true);
                            initPage();
                            toastr.success("", "菜单删除成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "菜单删除失败");
                            }
                        }
                    });
                });
            };
        }
    ]
).controller('MenuEditController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'MenuService',
        function ($rootScope, $scope, $location, $uibModal, toastr, MenuService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            if ($scope.id) {
                //编辑
                MenuService.get($scope.id).$promise.then(function (result) {
                    if ("success" == result.status) {
                        $scope.model = result.data;
                        if (!$scope.model.parentId) {
                            $scope.model.parentId = "-1";
                            $scope.model.parentTitle = "根菜单";
                        }
                        $scope.copy_model = angular.copy($scope.model);
                    } else {
                        for (var index in result.errors) {
                            toastr.error(result.errors[index].errmsg, "菜单信息获取失败");
                        }
                    }
                });
            } else {
                //新建
                $scope.model = {};
                $scope.model.enabled = true;
                $scope.model.type = "site";
                $scope.copy_model = angular.copy($scope.model);
            }

            $scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    MenuService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            $rootScope.$broadcast("initMenuEvent", true);
                            toastr.success("", "菜单信息保存成功");
                            $location.path("/system/menu/list.html").search({});
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "菜单信息保存失败");
                            }
                        }
                    });
                }
            };

            $scope.selectParentMenu = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'menuTree.html',
                    controller: "MenuTreeSelectParentController",
                    resolve: {
                        currentMenuId: function () {
                            return $scope.id;
                        },
                        currentParentId: function () {
                            return $scope.model.parentId;
                        }
                    }
                });
                modalInstance.result.then(function (selectnode) {
                    $scope.model.parentId = selectnode.id;
                    $scope.model.parentTitle = selectnode.text;
                });
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/system/menu/list.html").search({});
            };
        }
    ]
).filter("enabledFilter", function () {
    return function (value) {
        if (value) {
            return "启用";
        } else {
            return "禁用";
        }
    }
});

angular.module("MetronicApp").controller('MenuTreeSelectParentController',
    ['$rootScope', '$scope', '$uibModalInstance', '$timeout', "toastr", 'MenuService', 'currentMenuId', 'currentParentId',
        function ($rootScope, $scope, $uibModalInstance, $timeout, toastr, MenuService, currentMenuId, currentParentId) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                Metronic.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.treeData = [];

            $scope.treeConfig = {
                core: {
                    multiple: false,
                    animation: true,
                    error: function (error) {
                        toastr.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true
                },
                version: 1
            };
            MenuService.getMenuTree().$promise.then(function (result) {
                $scope.treeData = result.data;
                $scope.treeConfig.version++;
            });

            $scope.applyModelChanges = function () {
                return true;
            };

            $scope.menuTreeLoadedReady = function () {
                $scope.treeInstance.jstree(true).open_all("-1");
                if (currentParentId) {
                    $scope.treeInstance.jstree().select_node(currentParentId);
                }
            };

            $scope.selectMenuNode = function () {
                $scope.selectnode = $scope.treeInstance.jstree(true).get_selected('true')[0];
            };

            $scope.btn_ok = function () {
                if (!$scope.selectnode) {
                    toastr.error("", "请选择父菜单");
                    return;
                }
                if (currentMenuId || currentMenuId == 0) {
                    if ($scope.selectnode.id == currentMenuId) {
                        toastr.error("", "你不能选择自己作为父菜单");
                    } else {
                        $uibModalInstance.close($scope.selectnode);
                    }
                } else {
                    $uibModalInstance.close($scope.selectnode);
                }
            };
            $scope.btn_cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]
);