angular.module("MetronicApp").controller('TravelExpenseController',
    ['$rootScope', '$scope', '$location', '$timeout', 'EnumService', 'TravelExpenseService', '$window', 'DictService','FileStorageService', 'toastr',
        function ($rootScope, $scope, $location, $timeout, EnumService,  TravelExpenseService, $window, DictService,FileStorageService, toastr) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });
            $scope.model = {};
            //ng-table about
            $scope.columns = TravelExpenseService.getSchema();
            $scope.sort = TravelExpenseService.getSort();
            $scope.order = TravelExpenseService.getOrder();
            $scope.pageable = TravelExpenseService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                TravelExpenseService.list(function (result) {
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
                TravelExpenseService.setSize(newVal);
                TravelExpenseService.setStoredPage(0);
                $scope.searchForWatch();
            });
            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                TravelExpenseService.setStoredPage(newVal);
                $scope.searchForWatch();
            });
            //fetch data when the sort or order changed
            $scope.$watch('sort', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                TravelExpenseService.setSort(newVal);
                $scope.searchForWatch();
            });
            $scope.$watch('order', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                TravelExpenseService.setOrder(newVal);
                $scope.searchForWatch();
            });

            //search
            $scope.search = function () {
                $scope.list();
            };

            $scope.download = function (row) {
                var searchable = [];
                FileStorageService.exportExcelfile('/w/travelReimburses/export/'+row.id, searchable, '差旅费报销单.xls');
            };
            //search
            $scope.searchForWatch = function () {
                TravelExpenseService.putSearchParams({
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

            //批量删除
            $scope.deleteInfo = function () {
                var searchable = {};
                angular.copy($scope.model, searchable);
                searchable.batchDelete = true;
                TravelExpenseService.putSearchParams(searchable);
                TravelExpenseService.setStoredPage(0);
                $scope.list1();
                $scope.checkedList = [];
            };
            //$scope.checkedList=[];
            $scope.confirm = function () {
                //$scope.checkedList=[];
                var cinemaApplicationIds = [];
                for (var i in $scope.checkedList) {
                    cinemaApplicationIds.push($scope.checkedList[i].cinemaApplicationId);
                }
                var modelInfo = {"ids": cinemaApplicationIds}
                TravelExpenseService.getBatchDelete(modelInfo).$promise.then(function (res) {
                    if ('success' == res.status) {
                        toastr.success('', '成功删除影院信息！');
                    } else {
                        if (res.errors.length >= 0) {
                            angular.forEach(res.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "查询异常！");
                        }
                    }
                })
            };

            //删除
            $scope.delete = function (id) {
                $scope.id = id;
            }

            $scope.confirmDelete = function () {
                TravelExpenseService.delete($scope.id).$promise.then(function (res) {
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

            $scope.view = function (row) {
                $location.path('/reimbursement/travelExpense/view.html').search({
                    id: row.id,
                });
            };
            $scope.edit = function (row) {
                $location.path('/reimbursement/travelExpense/create.html').search({
                    id: row.id,
                });
            };
            /**
             * 导出
             */
            $scope.exportExcel = function () {
                var searchable = {
                    cinemaCode: $scope.model.cinemaCode,
                    shortName: $scope.model.shortName,
                    regionCodeList: $scope.model.regionCodeList,
                    webProvinceCode: $scope.model.provinceIdList,
                    webCityCode: $scope.model.cityCodeList,
                    webCountyCode: $scope.model.countyCodeList,
                    cinemaChainId: $scope.model.cinemaChainId,
                    applicationStatus: $scope.model.applicationStatus,
                    havingTestData: $scope.model.havingTestData
                }

                TravelExpenseService.exportExcelfileInfo(searchable);
            };



        }])
    .controller('TravelExpenseCreateController',
        ['$rootScope', '$scope', '$location', 'toastr', 'TravelExpenseService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, TravelExpenseService, DictService, EnumService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                })


                $scope.model = {};
                TravelExpenseService.getUserDept().$promise.then(function (result) {
                    $scope.userDept=result;
                    $scope.model.depId = result.data.id;
                })

                    //获取枚举类型数组
                $scope.vehicleType = EnumService.get("vehicle");

                $scope.vehicleChange=function (value) {
                    $scope.vehicleLevelType=EnumService.get("vehicle"+value);
                }

                $scope.trafficeFeeChange = function () {
                    $scope.hallTrafficeFee = TravelExpenseService.getTrafficeFeeSum($scope.model.trafficReimburse);
                    if (!$scope.hallTrafficeFee) {
                        $scope.hallTrafficeFee = 0;
                    }
                    totalCalc();
                };
                function totalCalc() {
                    //对页面产生的费用进行合计
                    $scope.totalMoney=parseFloat($scope.model.hotelExpense)+parseFloat($scope.model.otherFee)
                        +($scope.model.trafficSubsidyDays*$scope.model.trafficSubsidyNum*$scope.trafficSubsidyMoney)
                        +($scope.model.foodAllowanceDays*$scope.model.foodAllowanceNum*$scope.foodAllowanceMoney)
                        +parseFloat($scope.hallTrafficeFee);
                    $scope.totalMoneyStr="人民币 "+digitUppercase($scope.totalMoney);
                }
                var id = $location.search().id;
                if(id){
                    TravelExpenseService.getForm(id).$promise.then(function (res) {
                        $scope.model = res.data;
                        angular.forEach(res.data.trafficReimburse, function (every) {
                            $scope.hallTrafficeFee += every.trafficeFee;
                        });
                        totalCalc();
                    });


                }


                $scope.hallNum = 0;
                $scope.hallTrafficeFee = 0;
                $scope.costSum = 0;
                $scope.trafficSubsidyMoney=80;//交通补助
                $scope.foodAllowanceMoney=100;//伙食补助

                //提交处理，页面存在三个表单，提交时，需对三个表单同时校验
                $scope.submit = function (baseForm,costForm, hallForm) {
                    baseForm.$submitted = true;
                    costForm.$submitted = true;
                    hallForm.$submitted = true;

                    //如果三个表单都校验通过，则发送请求
                    if (baseForm.$valid && costForm.$valid && hallForm.$valid) {

                        TravelExpenseService.save($scope.model).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $location.path("/reimbursement/travelExpense/list.html").search({});
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
                $scope.model.trafficReimburse = [];
                //定义影厅表结构，方便动态添加操作
                var hallSchema = {
                    trafficTime: "",
                    source: "",
                    Destination: "",
                    vehicle: "",
                    level: "",
                    trafficeFee: "",
                    editing: true, //自定义字段，方便前端逻辑处理
                    deleting: false //自定义字段，方便前端逻辑处理
                };
                //动态添加影厅表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addHallElement = function (hallForm) {
                    if ($scope.model.trafficReimburse.length === 0) {
                        hallForm.$valid = true;
                    }
                    if (hallForm.$valid) {
                        $scope.flag = true;
                        var editRecord = _.findWhere($scope.model.trafficReimburse, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.trafficReimburse.push(angular.copy(hallSchema));
                    }
                    $scope.hallNum = $scope.model.trafficReimburse.length;
                };
                //删除影厅表记录，如果是原始数据，则置deleting=false；如果是新增的，则直接从页面删除
                $scope.deleteHallElement = function (index, hallModel) {
                    angular.forEach($scope.model.trafficReimburse, function (value, key) {
                        value.editing = false;
                    });
                    $scope.model.trafficReimburse.splice(index, 1);
                    $scope.hallNum = $scope.model.trafficReimburse.length;
                    $scope.hallTrafficeFee = TravelExpenseService.getTrafficeFeeSum($scope.model.trafficReimburse);
                };
                //恢复已删除记录
                $scope.restoreHallElement = function (index, hallModel) {
                    hallModel.deleting = false;
                };
                //编辑记录
                $scope.editHallElement = function (index, hallModel, hallForm) {
                    if (hallForm.$invalid) return;
                    angular.forEach($scope.model.trafficReimburse, function (value, key) {
                        if (index != key) {
                            value.editing = false;
                        }else{
                            $scope.vehicleLevelType=EnumService.get("vehicle"+$scope.model.trafficReimburse[index].vehicle);
                        }
                    });
                    hallModel.editing = true;
                    $scope.flag = false;
                };

            }])
    .filter("vehicleTypeFilter",["EnumService",function(EnumService){
        return function (value) {
            var vehicleResult = EnumService.get("vehicle");
            var vehicleResultType = _.find(vehicleResult, function (status) {
                    return status.key == value;
                }
            );
            return vehicleResultType ? vehicleResultType.text : "";
        };
    }])
    .filter("vehicleLevelTypeFilter",["EnumService",function(EnumService){
        return function (value) {
            var vehicleLevelResult = EnumService.get("vehicleAllSeat");
            var vehicleLevelResultType = _.find(vehicleLevelResult, function (status) {
                    return status.key == value;
                }
            );
            return vehicleLevelResultType ? vehicleLevelResultType.text : "";
        };
    }])
    .filter("timestampToDateExt",["$filter",function ($filter) {
        return function (value) {
            if (value != null && value._i != undefined) {
                value=value._i;
            }
            const filter = $filter("date");
            return filter(value, "yyyy-MM-dd");
        }
    }])
;