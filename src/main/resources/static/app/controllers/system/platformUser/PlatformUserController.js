/**
 * 平台用户用户管理
 * Created by lijing on 2016/6/21.
 */
angular.module("MetronicApp").controller('PlatformUserController',
    ['$rootScope', '$scope', '$location', '$uibModal', "toastr", 'PlatformUserService',
        function ($rootScope, $scope, $location, $uibModal, toastr, PlatformUserService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            //ng-table about
            $scope.columns = PlatformUserService.getSchema();
            $scope.sort = PlatformUserService.getSort();
            $scope.order = PlatformUserService.getOrder();
            $scope.pageable = PlatformUserService.getPageable();
            $scope.selectable = true;

            //method of fetch list data
            $scope.list = function () {
                PlatformUserService.list().$promise.then(function (result) {
                    $scope.rows = result.data;

                    /**实现默认选中*/
                    for (var i = 0; i < $scope.rows.length; i++) {
                        if ($scope.rows[i].id == 1) {
                            $scope.rows[i].selected = true
                        }
                    }
                    //storage page state
                    PlatformUserService.setStoredPage(result.pageable.number);
                    $scope.pageable = result.pageable;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            var gotoFirstPage = function () {
                PlatformUserService.setStoredPage(0);
                $scope.list();
            };

            //start to fetch list data
            $scope.condition = {};
            PlatformUserService.clearSearchParams();
            gotoFirstPage();

            //fetch data when the size of page changed
            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                PlatformUserService.setSize(newVal);
                gotoFirstPage();
            });

            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                PlatformUserService.setStoredPage(newVal);
                $scope.list();
            });

            $scope.$watch('sort', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                PlatformUserService.setSort(newValue);
                $scope.list();
            });
            $scope.$watch('order', function (newValue, oldValue) {
                if (oldValue == newValue) return;
                PlatformUserService.setOrder(newValue);
                $scope.list();
            });

            $scope.create = function () {
                $location.path("/system/platformUser/create.html").search({});
            };

            //search
            $scope.search = function () {
                PlatformUserService.putSearchParams(
                    {
                        name: $scope.condition.name
                    }
                );
                gotoFirstPage();
            };

            //跳转页面并传递参数
            $scope.view = function (id) {
            	$scope.viewid = id;
                $location.path("/system/platformUser/view.html").search({"id": id});
            };

            $scope.edit = function (id) {
                $location.path("/system/platformUser/edit.html").search({"id": id});
            };
            $scope.passwordEdit = function (id) {
                $location.path("/system/platformUser/password.html").search({"id": id});
            };

            $scope.discard = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认禁用该用户吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(row.id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    PlatformUserService.disableUser(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            row.enabled = false;
                            toastr.success("", "用户禁用成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "用户禁用失败");
                            }
                        }
                    });
                });
            };

            $scope.enable = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.confirmContent = "确认启用该用户吗？";
                        scope.btn_ok = function () {
                            $uibModalInstance.close(row.id);
                        };
                        scope.btn_cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }]
                });

                modalInstance.result.then(function (id) {
                    PlatformUserService.enableUser(id).$promise.then(function (result) {
                        if ("success" == result.status) {
                            row.enabled = false;
                            toastr.success("", "用户启用成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "用户启用失败");
                            }
                        }
                    });
                });
            };
        }
    ]
).controller('PlatformUserEditController',
    ['$rootScope', '$scope', '$location', 'EnumService', 'PlatformUserService','toastr',
        function ($rootScope, $scope, $location, EnumService, PlatformUserService,toastr) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.id = $location.search().id;
            $scope.genderDatas = EnumService.get("genderType");
            PlatformUserService.getAllRoles().$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.rolesData = result.data;
                } else {
                    for (var index in result.errors) {
                        toastr.error(result.errors[index].errmsg, "角色信息获取失败");
                    }
                }
                if ($scope.id) {
                    //编辑
                    PlatformUserService.get($scope.id).$promise.then(function (result) {
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
            });


            $scope.submit = function (form, formCorporation) {
                form.$submitted = true;
                formCorporation.$submitted = true;
                if (form.$valid && formCorporation.$valid) {
                    PlatformUserService.save($scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "平台用户信息保存成功");
                            $location.path("/system/platformUser/list.html").search({});
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
                $location.path("/system/platformUser/list.html").search({});
            };
        }
    ]
).controller('PlatformUserPasswordEditController',
    ['$rootScope', '$scope', '$location', 'toastr', 'PlatformUserService',
        function ($rootScope, $scope, $location, toastr, PlatformUserService) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.id = $location.search().id;
            $scope.model = {
                password: "",
                repeatPassword: ""
            };
            $scope.copy_model = angular.copy($scope.model);
            $scope.submit = function (form) {
                form.$submitted = true;
                if (form.$valid) {
                    PlatformUserService.changePassword($scope.id, $scope.model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            toastr.success("", "平台用户信息密码修改成功");
                            $location.path("/system/platformUser/list.html").search({});
                        } else {
                            for (var index in result.errors) {
                                toastr.error("平台用户信息密码修改失败，", result.errors[index].errmsg);
                            }
                        }
                    });
                }
            };

            $scope.reset = function () {
                $scope.model = angular.copy($scope.copy_model);
            };

            $scope.back = function () {
                $location.path("/system/platformUser/list.html").search({});
            };
        }
    ]
).filter("platformFilter", function () {
    return function (value) {
        if (value) {
            return "启用";
        } else {
            return "禁用";
        }
    }
}).filter("roleNamesFilter", function () {
    return function (value) {
        var str = "";
        for (var index in value) {
            str += value[index] + "  ";
        }
        return str;
    }
}).filter("genderFilter", ["EnumService", function (EnumService) {
    var genderDatas = EnumService.get("genderType");
    return function (value) {
        var even = _.find(genderDatas, {"key": value});
        return even ? even.text : value;
    }
}]);
