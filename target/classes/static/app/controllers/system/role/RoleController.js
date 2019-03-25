/**
 * Created by wangwj on 2016/6/6.
 */
angular.module("MetronicApp").controller('RoleListController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'RoleService',
        function ($rootScope, $scope, $location, $uibModal, toastr, RoleService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //ng-table about
            $scope.columns = RoleService.getSchema();
            $scope.sort = RoleService.getSort();
            $scope.order = RoleService.getOrder();
            $scope.pageable = RoleService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                RoleService.list().$promise.then(function (result) {
                    $scope.rows = result.data;
                    //storage page state
                    RoleService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                RoleService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            $scope.condition = {};
            RoleService.clearSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                RoleService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                RoleService.setStoredPage(newVal - 1);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                RoleService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                RoleService.setOrder(newValue);
                $scope.list();
            });

            $scope.create = function () {
                $location.path("/system/role/create.html").search({});
            };

            //跳转页面并传递参数
            $scope.view = function (id) {
                $location.path("/system/role/view.html").search({"id": id});
            };

            $scope.edit = function (id) {
                $location.path("/system/role/edit.html").search({"id": id});
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
                    RoleService.delete(id).$promise.then(function (result) {
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

            $scope.setPermission = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'menuTree.html',
                    controller: "MenuTreeSetPermissionController",
                    resolve: {
                        roleId: function () {
                            return id;
                        }
                    }
                });
                modalInstance.result.then(function (selectNodes) {
                    var menuIds = [];
                    for (var index in selectNodes) {
                        if (selectNodes[index].id == "-1") {
                            continue;
                        }
                        menuIds.push(selectNodes[index].id);
                    }
                    var param = {id: id, menuIds: menuIds};
                    RoleService.updateRoleMenus(param).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "角色菜单权限设置成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "角色菜单权限设置失败");
                            }
                        }
                    });
                });
            };
        }
    ]
).controller('RoleEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'EnumService', 'RoleService',
        function ($rootScope, $scope, $location, toastr, EnumService, RoleService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;

            if ($scope.id) {
                //编辑
                RoleService.get($scope.id).$promise.then(function (result) {
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
                    RoleService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "角色信息保存成功");
                            $location.path("/system/role/list.html").search({});
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "角色信息保存失败");
                            }
                        }
                    });
                }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/system/role/list.html").search({});
            };
        }
    ]
).controller('MenuTreeSetPermissionController',
    ['$rootScope', '$scope', '$uibModalInstance', "toastr", 'RoleService', 'roleId',
        function ($rootScope, $scope, $uibModalInstance, toastr, RoleService, roleId) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            RoleService.getRoleMenus(roleId).$promise.then(function (result) {
                if (result.status === 'success') {
                    if (result.data) {
                        $scope.id = result.data.id;
                        $scope.menuIds = result.data.menuIds;
                    }
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "角色菜单权限拉取失败");
                    }
                }
            });

            $scope.treeData = [];

            $scope.treeConfig = {
                core: {
                    multiple: true,
                    animation: true,
                    error: function (error) {
                        toastr.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true
                },
                version: 1,
                plugins: ['checkbox']
            };
            RoleService.getMenuTree().$promise.then(function (result) {
                $scope.treeData = result.data;
                $scope.treeConfig.version++;
            });

            $scope.applyModelChanges = function () {
                return true;
            };

            $scope.menuTreeLoadedReady = function () {
                $scope.treeInstance.jstree(true).open_all("-1");
                if ($scope.menuIds) {
                    for (var index in $scope.menuIds) {
                        $scope.treeInstance.jstree().select_node($scope.menuIds[index]);
                    }
                }
            };

            $scope.btn_ok = function () {
                var selectedNodes = $scope.treeInstance.jstree(true).get_selected('true');
                $uibModalInstance.close(selectedNodes);
            };
            $scope.btn_cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]
);