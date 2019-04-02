angular.module("MetronicApp").controller('CurrencyReimbursementController',
    ['$rootScope', '$scope', '$location', '$timeout', 'EnumService', 'CurrencyReimbursementService', '$window', 'DictService', 'toastr',
        function ($rootScope, $scope, $location, $timeout, EnumService, CurrencyReimbursementService, $window, DictService, toastr) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.model = {};
            //ng-table about
            $scope.columns = CurrencyReimbursementService.getSchema();
            $scope.sort = CurrencyReimbursementService.getSort();
            $scope.order = CurrencyReimbursementService.getOrder();
            $scope.pageable = CurrencyReimbursementService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                CurrencyReimbursementService.list(function (result) {
                    if ('success' == result.status) {
                        $scope.rows = result.data;
                        $scope.pageable = result.pageable;
                    } else {
                        if (result.errors.length >= 0) {
                            angular.forEach(result.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "查询异常！");
                        }
                    }
                });
            };

            $scope.$watch('pageable.size', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CurrencyReimbursementService.setSize(newVal);
                CurrencyReimbursementService.setStoredPage(0);
                $scope.searchForWatch();
            });
            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CurrencyReimbursementService.setStoredPage(newVal);
                $scope.searchForWatch();
            });
            //fetch data when the sort or order changed
            $scope.$watch('sort', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CurrencyReimbursementService.setSort(newVal);
                $scope.searchForWatch();
            });
            $scope.$watch('order', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                CurrencyReimbursementService.setOrder(newVal);
                $scope.searchForWatch();
            });

            //search
            $scope.search = function () {
                $scope.list();
            };
            //search
            $scope.searchForWatch = function () {
                CurrencyReimbursementService.putSearchParams({
                    cinemaCode: $scope.model.cinemaCode,
                    shortName: $scope.model.shortName,
                    regionCodeList: $scope.model.regionCodeList,
                    webProvinceCode: $scope.model.provinceIdList,
                    webCityCode: $scope.model.cityCodeList,
                    webCountyCode: $scope.model.countyCodeList,
                    cinemaChainId: $scope.model.cinemaChainId,
                    applicationStatus: $scope.model.applicationStatus,
                    havingTestData: $scope.model.havingTestData
                });
                $scope.list();
            };

            $scope.delete = function (id) {
                $scope.id = id;
            }

            $scope.logOut = function () {
                CurrencyReimbursementService.getDelete($scope.id).$promise.then(function (res) {
                    if ('success' == res.status) {
                        toastr.success('', '成功删除该报销单！');
                        $scope.list();
                    } else {
                        if (res.errors.length >= 0) {
                            angular.forEach(res.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "删除异常！");
                        }
                    }
                })
            };

            $scope.view1 = function (row) {
                $location.path('/reimbursement/currency/view.html').search({
                    id: row.id,
                });
            };
            $scope.edit1 = function (row) {
                $location.path('/reimbursement/currency/create.html').search({
                    id: row.id,
                });
            };
            /**
             * 导出
             */
            $scope.exportExcel = function () {
                CurrencyReimbursementService.exportExcelfileInfo(searchable);
            };

        }])
    .controller('CurrencyReimbursementCreateController',
        ['$rootScope', '$scope', '$location', 'toastr', 'CurrencyReimbursementService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, CurrencyReimbursementService, DictService, EnumService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                })

                $scope.model = {};
                //获取枚举类型数组
                $scope.playUnitTypeOptions = EnumService.get("Subject");
                // 厅编码
                $scope.compareCode = function (value) {
                    var flag = true;
                    for (var i = 0; i < $scope.model.details.length - 1; i++) {
                        if (value == $scope.model.details[i].code) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                };
                var id = $location.search().id;
                if(id){
                    CurrencyReimbursementService.getForm(id).$promise.then(function (res) {
                        $scope.model = res.data;
                        angular.forEach(res.data.details, function (every) {
                            $scope.seatSum += every.remiburseMoney;
                        });
                    });
                }


                $scope.hallNum = 0;
                $scope.seatSum = 0;

                $scope.seatCountsChange = function () {
                    $scope.seatSum = CurrencyReimbursementService.getSeatSum($scope.model.details);
                    if (!$scope.seatSum) {
                        $scope.seatSum = 0;
                    }
                };

                //提交处理，页面存在三个表单，提交时，需对三个表单同时校验
                $scope.submit = function (cinemaForm, hallForm) {
                    cinemaForm.$submitted = true;
                    hallForm.$submitted = true;

                    var message = "通用报销单基本信息为必填项";
                    if ($scope.model.details.length === 0) {
                        hallForm.$valid = false;
                        message = "发票详情为必填项";
                    }
                    //如果三个表单都校验通过，则发送请求
                    if (cinemaForm.$valid && hallForm.$valid) {
                        angular.forEach($scope.model.details, function (every) {
                            every.seatCounts = parseFloat(every.seatCounts);
                        });

                        CurrencyReimbursementService.save($scope.model).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $location.path("/reimbursement/currency/list.html").search({});
                                toastr.success("", "信息保存成功！");
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "信息保存失败！");
                                }
                            }
                        });
                        // }
                    } else {
                        toastr.error("", message);
                    }
                };

                $scope.flag = true;
                //BEGIN 影厅表操作
                $scope.model.details = [];
                //定义影厅表结构，方便动态添加操作
                var hallSchema = {
                    remark: "",
                    subId: "",
                    remiburseMoney: "",
                    editing: true, //自定义字段，方便前端逻辑处理
                    deleting: false //自定义字段，方便前端逻辑处理
                };
                //动态添加影厅表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addHallElement = function (hallForm) {
                    if ($scope.model.details.length === 0) {
                        hallForm.$valid = true;
                    }
                    if (hallForm.$valid) {
                        $scope.flag = true;
                        var editRecord = _.findWhere($scope.model.details, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.details.push(angular.copy(hallSchema));
                    }
                    $scope.hallNum = $scope.model.details.length;
                };
                //删除影厅表记录，如果是原始数据，则置deleting=false；如果是新增的，则直接从页面删除
                $scope.deleteHallElement = function (index, hallModel) {
                    angular.forEach($scope.model.details, function (value, key) {
                        value.editing = false;
                    });
                    $scope.model.details.splice(index, 1);
                    $scope.hallNum = $scope.model.details.length;
                    $scope.seatSum = CurrencyReimbursementService.getSeatSum($scope.model.details);
                };
                //恢复已删除记录
                $scope.restoreHallElement = function (index, hallModel) {
                    hallModel.deleting = false;
                };
                //编辑记录
                $scope.editHallElement = function (index, hallModel, hallForm) {
                    if (hallForm.$invalid) return;
                    angular.forEach($scope.model.details, function (value, key) {
                        if (index != key) {
                            value.editing = false;
                        }
                    });
                    hallModel.editing = true;
                    $scope.flag = false;
                };

            }])
    .controller('CurrencyReimbursementViewController',
        ['$rootScope', '$scope', '$location', 'CurrencyReimbursementService', 'DictService', '$timeout', 'EnumService', 'toastr',
            function ($rootScope, $scope, $location, CurrencyReimbursementService, DictService, $timeout, EnumService, toastr) {
                $scope.$on('$viewContentLoaded', function () {
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });

                var cinemaApplicationId = $location.search().id;
                $scope.status = $location.search().status;
                $scope.countryOptions = DictService.get("country");

                $scope.hallNum = 0;
                $scope.seatSum = 0;
                $scope.cinemaCode = '';
                //获取枚举类型

                $scope.cinemaCheckDetailsModel = {};
                CurrencyReimbursementService.getForm(cinemaApplicationId).$promise.then(function (res) {
                    $scope.model = res.data;
                    angular.forEach(res.data.details, function (every) {
                        $scope.seatSum += every.remiburseMoney;
                    });
                });

                $scope.return = function () {
                    $location.path('/reimbursement/currency/list.html').search({storeParam:true});
                };

            }])
    .filter("projectorTypeDateTypeFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var projectorTypeDate = EnumService.get("Subject");
            var projectorTypeDateType = _.find(projectorTypeDate, function (status) {
                    return status.key == value;
                }
            );
            return projectorTypeDateType ? projectorTypeDateType.text : "";
        };
    }])
    .filter("projectorResolutionDateFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var projectorResolutionDate = EnumService.get("projectorResolutionDate");
            var projectorResolutionDateType = _.find(projectorResolutionDate, function (status) {
                    return status.key == value;
                }
            );
            return projectorResolutionDateType ? projectorResolutionDateType.text : "";
        }
    }])
;