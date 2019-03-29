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
    .controller('CinemaSignUpAuditCreateController',
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
    .controller('CinemaSignUpAuditEditController',
        ['$rootScope', '$scope', '$location', 'toastr', 'CurrencyReimbursementService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, CurrencyReimbursementService, DictService, EnumService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });

                $scope.modelCopy = {};
                $scope.model = {
                    softwareName: "",
                    pcsell: "true"
                };

                $scope.allProvinces = [];
                $scope.allCitys = [];
                $scope.allRegions = [];
                $scope.allCountys = [];
                $scope.cinemaChains = [];

                CurrencyReimbursementService.getAllRegions().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.allRegions = result.data;
                    }
                });

                CurrencyReimbursementService.getAllProvince().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.allProvinces = result.data;

                    }
                });

                $scope.getProvince = function () {
                    $scope.model.provinceCode = '';
                    $scope.model.cityCode = '';
                    $scope.model.countyCode = '';
                    if (!$scope.model.regionCode) {
                        return;
                    }
                    $scope.allProvinces = "";
                    $scope.allCitys = "";
                    $scope.allCountys = "";
                    CurrencyReimbursementService.getAllProvinces($scope.model.regionCode).$promise.then(function (result) {
                        if ('success' == result.status) {
                            $scope.allProvinces = result.data;

                        }
                    });
                };

                $scope.getCity = function () {
                    $scope.model.cityCode = '';
                    $scope.model.countyCode = '';
                    if ($scope.model.provinceCode) {
                        CurrencyReimbursementService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $scope.allCitys = result.data;
                            }
                        });
                        CurrencyReimbursementService.getRegionByProvinceCode($scope.model.provinceCode).$promise.then(function (result){
                            if("success" == result.status){
                                $scope.model.regionCode = result.data.code;
                                $scope.model.regionName = result.data.name;
                            }
                        });
                    }
                };

                $scope.getCounty = function () {
                    $scope.model.countyCode = '';
                    if (!$scope.model.cityCode) {
                        return;
                    }
                    if ($scope.model.cityCode) {
                        CurrencyReimbursementService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $scope.allCountys = result.data;
                                if($scope.allCountys.length == 1 && $scope.allCountys[0].name == '市辖区'){
                                    $scope.model.countyCode = $scope.allCountys[0].code;
                                    $scope.autoGenerate();
                                }
                            }
                        });
                    }
                };

                $scope.cinemaAddress = function () {
                    var regionCode = $scope.model.regionCode;
                    var region = _.find($scope.allRegions, function (data) {
                            return data.code == regionCode;
                        }
                    );
                    var provinceCode = $scope.model.provinceCode;
                    var province = _.find($scope.allProvinces, function (data) {
                            return data.code == provinceCode;
                        }
                    );
                    var cityCode = $scope.model.cityCode;
                    var city = _.find($scope.allCitys, function (data) {
                            return data.code == cityCode;
                        }
                    );
                    var countyCode = $scope.model.countyCode;
                    var county = _.find($scope.allCountys, function (data) {
                            return data.code == countyCode;
                        }
                    );
                    if (region && province && city && county) {
                        if("北京市，天津市，上海市，重庆市".indexOf(province.name) !== -1){
                            $scope.model.tempAddress = province.name + city.name;
                        }else{
                            $scope.model.tempAddress = province.name + city.name + county.name;
                        }
                    }
                };

                $scope.autoGenerate = function () {
                    $scope.cinemaAddress();
                };

                //传递过来的ID
                var cinemaApplicationId = $location.search().id;
                CurrencyReimbursementService.softwareUrl().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.softwares = result.data;
                        CurrencyReimbursementService.getForm(cinemaApplicationId).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $scope.model = result.data;
                                //处理地址，将地址分为两部分
                                if($scope.model.countyName == "市辖区" && $scope.model.address){
                                    var index = $scope.model.address.indexOf($scope.model.cityName);
                                    $scope.model.tempAddress = $scope.model.address.substring(0, (index + $scope.model.cityName.length));
                                    $scope.model.address = $scope.model.address.substring(index + $scope.model.cityName.length);
                                }else{
                                    var index = $scope.model.address.indexOf($scope.model.countyName);
                                    $scope.model.tempAddress = $scope.model.address.substring(0, (index + $scope.model.countyName.length));
                                    $scope.model.address = $scope.model.address.substring(index + $scope.model.countyName.length);
                                }
                                if ($scope.model.code) {
                                    $scope.model.seq = $scope.model.code.substring(4, 7) ? $scope.model.code.substring(4, 7) : '';
                                }
                                var softwareVersionTemp = angular.copy($scope.model.softwareVersion);
                                $scope.model.pcsell = $scope.model.pcsell + "";
                                //var playUnitTypes = EnumService.get("playUnitType");
                                //var res = _.find(playUnitTypes, function (status) {
                                //        return status.key == $scope.model.playUnitType;
                                //    }
                                //);
                                //if (res) {
                                //    $scope.playUnitTypeTemp = $scope.model.playUnitType;
                                //    $scope.model.playUnitType = res.text;
                                //}
                                var modelCopy = angular.copy($scope.model);
                                if ($scope.model.softwareName) {
                                    CurrencyReimbursementService.softwareVersionUrl($scope.model.softwareName).$promise.then(function (result) {
                                        if ('success' == result.status) {
                                            $scope.softwareVersions = result.data;
                                            $scope.model.softwareVersion = angular.copy(softwareVersionTemp);
                                        }
                                    });
                                }
                                CurrencyReimbursementService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
                                    if ('success' == result.status) {
                                        $scope.allCountys = result.data;
                                        $scope.model.provinceCode = modelCopy.provinceCode;
                                    }
                                });
                                CurrencyReimbursementService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                                    if ('success' == result.status) {
                                        $scope.allCitys = result.data;
                                        $scope.model.cityCode = modelCopy.cityCode;
                                    }
                                });
                                CurrencyReimbursementService.getAllProvince().$promise.then(function (result) {
                                    if ('success' == result.status) {
                                        $scope.allProvinces = result.data;
                                        $scope.model.countyCode = modelCopy.countyCode;
                                    }
                                });
                                //$scope.getInfo();
                                //toastr.success("", "获取信息成功！");
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "获取信息失败！");
                                }
                            }

                        });
                    }
                });
                //};
                $scope.countryOptions = DictService.get('country');

                //$scope.model = {};
                CurrencyReimbursementService.getCreateCinemaChain().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.cinemaChains = result.data;
                    }
                });

                $scope.compareCode = function (value) {
                    var flag = true;
                    for (var i = 0; i < $scope.model.screens.length - 1; i++) {
                        if (value == $scope.model.screens[i].code) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                };
                // $scope.cinemaAddress = function () {
                //     var regionCode = $scope.model.regionCode;
                //     var region = _.find($scope.allRegions, function (data) {
                //             return data.code == regionCode;
                //         }
                //     );
                //     var provinceCode = $scope.model.provinceCode;
                //     var province = _.find($scope.allProvinces, function (data) {
                //             return data.code == provinceCode;
                //         }
                //     );
                //     var cityCode = $scope.model.cityCode;
                //     var city = _.find($scope.allCitys, function (data) {
                //             return data.code == cityCode;
                //         }
                //     );
                //     var countyCode = $scope.model.countyCode;
                //     var county = _.find($scope.allCountys, function (data) {
                //             return data.code == countyCode;
                //         }
                //     );
                //     if (region && province && city && county) {
                //         $scope.model.address = region.name + province.name + city.name + county.name;
                //     }
                //
                // };
                //
                // $scope.autoGenerate = function () {
                //     $scope.cinemaAddress();
                // };

                $scope.hallNum = 0;
                $scope.seatSum = 0;
                $scope.seatCountsChange = function () {
                    $scope.seatSum = CurrencyReimbursementService.getSeatSum($scope.model.screens);
                    if (!$scope.seatSum) {
                        $scope.seatSum = 0;
                    }
                };

                //重置
                $scope.reset = function (cinemaForm, hallForm, investmentForm) {
                    $scope.model = angular.copy($scope.modelCopy);
                    $scope.hallNum = $scope.model.screens.length;
                    $scope.seatCountsChange();
                    cinemaForm.$submitted = false;
                    hallForm.$submitted = false;
                    investmentForm.$submitted = false;
                };

                //获取枚举类型数组
                $scope.playUnitTypeOptions = EnumService.get("playUnitType");
                $scope.companyTypeDateOptions = EnumService.get("companyTypeDate");
                $scope.placeTypeDateOptions = EnumService.get("placeTypeDate");
                $scope.cinemaLevelDateOptions = EnumService.get("cinemaLevelDate");
                $scope.cinemaGradeDateOptions = EnumService.get("cinemaGradeDate");
                $scope.projectorTypeDateOptions = EnumService.get("projectorTypeDate");
                $scope.projectorResolutionDateOptions = EnumService.get("projectorResolutionDate");
                $scope.placementDateOptions = EnumService.get("placementDate");
                $scope.hallTypeDateOptions = EnumService.get("hallTypeDate");
                $scope.businessTypeScreenOptions = EnumService.get("businessTypeScreen");


                //提交处理，页面存在三个表单，提交时，需对三个表单同时校验
                $scope.submit = function (cinemaForm, hallForm, investmentForm, applyForm) {
                    if($scope.model.tempAddress && $scope.model.address){
                        $scope.model.address = $scope.model.tempAddress + $scope.model.address;
                    }
                    if ($scope.model.pcsell === undefined) {
                        toastr.warning("", "请选择是否电脑售票");
                    }
                    cinemaForm.$submitted = true;
                    hallForm.$submitted = true;
                    investmentForm.$submitted = true;
                    applyForm.$submitted = true;

                    var message = "影院基本信息为必填项";
                    if ($scope.model.screens.length === 0) {
                        hallForm.$valid = false;
                        message = "影厅信息为必填项";
                    } else if ($scope.model.shareholders === 0) {
                        investmentForm.$valid = false;
                        message = "影院资本投资构成信息为必填项";
                    }
                    //如果三个表单都校验通过，则发送请求
                    if (cinemaForm.$valid && hallForm.$valid && investmentForm.$valid && applyForm.$valid) {
                        var totalRatio = 0;
                        for (var index in $scope.model.shareholders) {
                            totalRatio += parseInt($scope.model.shareholders[index].ratio);
                        }
                        if (totalRatio > 100) {
                            toastr.error("", "影院资本投资构成信息参股比例不能超过100！");
                            return;
                        }
                        var cinemaGradeDateType = _.find($scope.softwares, function (filmTypeObj) {
                            return filmTypeObj.id == $scope.model.softwareId;
                        });
                        //如果主表成功，子表失败，修改后提交主表为修改
                        $scope.model.pcsell = Boolean($scope.model.pcsell);
                        //$scope.model.playUnitType = $scope.playUnitTypeTemp;
                        CurrencyReimbursementService.updateCinema($scope.model, $scope.model.id).$promise.then(function (result) {
                            if ('success' == result.status) {
                                var cinemaCode = result.data.code;
                                for (var i = 0; i < $scope.model.screens.length; i++) {
                                    $scope.model.screens[i].cinemaCode = cinemaCode;
                                }
                                toastr.success("", "影院基本信息修改成功！");
                                $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "修改信息失败！");
                                }
                            }
                        });
                    }
                };

                $scope.flag = true;
                //BEGIN 影厅表操作
                $scope.model.screens = [];
                //定义影厅表结构，方便动态添加操作
                var hallSchema = {
                    id: "",
                    cinemaCode: "",
                    code: "",
                    name: "",
                    seats: "",
                    projectorType: "",
                    projectorBrand: "",
                    projectorModel: "",
                    projectorNumber: "",
                    projectorResolution: "",
                    placement: "",
                    hallType: "",
                    businessType:"",
                    disabled: null,

                    editing: true, //自定义字段，方便前端逻辑处理
                    deleting: false //自定义字段，方便前端逻辑处理
                };
                //动态添加影厅表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addHallElement = function (hallForm) {
                    if (hallForm.$valid) {
                        $scope.flag = true;
                        var editRecord = _.findWhere($scope.model.screens, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.screens.push(angular.copy(hallSchema));
                    }
                    $scope.hallNum = $scope.model.screens.length;
                };
                //删除影厅表记录，如果是原始数据，则置deleting=false；如果是新增的，则直接从页面删除
                $scope.deleteHallElement = function (index, hallModel) {
                    angular.forEach($scope.model.screens, function (value, key) {
                        value.editing = false;
                    });

                    $scope.model.screens.splice(index, 1);
                    $scope.hallNum = $scope.model.screens.length;
                    $scope.seatSum = CurrencyReimbursementService.getSeatSum($scope.model.screens);
                };
                //恢复已删除记录
                $scope.restoreHallElement = function (index, hallModel) {
                    hallModel.deleting = false;
                    hallModel.disabled = null;
                };
                //编辑记录
                $scope.editHallElement = function (index, hallModel, hallForm) {
                    if (hallForm.$invalid) return;
                    angular.forEach($scope.model.screens, function (value, key) {
                        if (index != key) {
                            value.editing = false;
                        }
                    });
                    hallModel.editing = true;
                    $scope.flag = false;
                };

                //BEGIN 影院资本投资构成表操作
                $scope.model.shareholders = [];
                //定义影院资本投资构成表结构，方便动态添加操作
                var investmentSchema = {
                    id: "",
                    cinemaCode: "",
                    shareholderName: "",
                    shareholderBelongs: "",
                    ratio: "",
                    isDelete: null,

                    editing: true, //自定义字段，方便前端逻辑处理
                    deleting: false //自定义字段，方便前端逻辑处理
                };
                //动态添加影院资本投资构成表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addInvestmentElement = function (investmentForm) {
                    if (investmentForm.$valid) {
                        var editRecord = _.findWhere($scope.model.shareholders, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.shareholders.push(angular.copy(investmentSchema));
                    }
                };
                //删除影院资本投资构成表记录，如果是原始数据，则置deleting=false；如果是新增的，则直接从页面删除
                $scope.deleteinvestmentElement = function (index, investmentModel) {
                    angular.forEach($scope.model.shareholders, function (value, key) {
                        value.editing = false;
                    });
                    $scope.model.shareholders.splice(index, 1);
                };
                //恢复已删除记录
                $scope.restoreinvestmentElement = function (index, investmentModel) {
                    investmentModel.deleting = false;
                    investmentModel.isDelete = null;
                };
                //编辑记录
                $scope.editinvestmentElement = function (index, investmentModel, investmentForm) {
                    if (investmentForm.$invalid) return;
                    angular.forEach($scope.model.shareholders, function (value, key) {
                        if (index != key) {
                            value.editing = false;
                        }
                    });
                    investmentModel.editing = true;
                };
                /**
                 * 返回上一页
                 */
                $scope.return = function () {
                    $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                };
            }])
    .controller('CinemaSignUpAuditEditOtherController',
        ['$rootScope', '$scope', '$location', 'toastr', 'CurrencyReimbursementService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, CurrencyReimbursementService, DictService, EnumService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });

                $scope.cinemaChains = [];

                CurrencyReimbursementService.getCreateCinemaChain().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.cinemaChains = result.data;
                    }
                });

                $scope.modelCopy = {};
                $scope.model = {
                    softwareName: ""
                };
                //获取枚举类型数组
                $scope.companyTypeDateOptions = EnumService.get("companyTypeDate");
                $scope.placeTypeDateOptions = EnumService.get("placeTypeDate");
                $scope.cinemaLevelDateOptions = EnumService.get("cinemaLevelDate");
                $scope.cinemaGradeDateOptions = EnumService.get("cinemaGradeDate");
                $scope.projectorTypeDateOptions = EnumService.get("projectorTypeDate");
                $scope.projectorResolutionDateOptions = EnumService.get("projectorResolutionDate");
                $scope.placementDateOptions = EnumService.get("placementDate");
                $scope.hallTypeDateOptions = EnumService.get("hallTypeDate");
                $scope.countryOptions = DictService.get("country");
                $scope.businessTypeScreenOptions = EnumService.get("businessTypeScreen");
                //传递过来的ID
                var cinemaApplicationId = $location.search().id;
                CurrencyReimbursementService.softwareUrl().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.softwares = result.data;
                    }
                });
                $scope.getVersion = function () {
                    if ($scope.model.softwareName) {
                        CurrencyReimbursementService.softwareVersionUrl($scope.model.softwareName).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $scope.softwareVersions = result.data;
                                //以便回显软件版本
                                $scope.model.softwareVersion = angular.copy($scope.softwareVersionTemp);
                            }
                        });
                    } else {
                        $scope.model.softwareVersion = ""
                    }
                };
                $scope.getSoftwareId = function () {
                    var playUnitType = _.find($scope.softwareVersions, function (status) {
                            return status.versionNumber == $scope.model.softwareVersion;
                        }
                    );
                    if (playUnitType) {
                        $scope.model.softwareId = playUnitType.id;
                        $scope.model.softwareName = playUnitType.name;
                        $scope.model.softwareVendorId = playUnitType.softwareVendorId;
                    }
                };
                CurrencyReimbursementService.getForm(cinemaApplicationId).$promise.then(function (res) {
                    if ('success' == res.status) {
                        $scope.model = res.data;
                        if (!$scope.model.screens) {
                            $scope.model.screens = [];
                        }
                        if (!$scope.model.shareholders) {
                            $scope.model.shareholders = [];
                        }
                        //以便回显软件版本
                        $scope.softwareVersionTemp = angular.copy($scope.model.softwareVersion);
                        $scope.getVersion();
                        if ($scope.model.provinceApproval.reportFileId) {
                            CurrencyReimbursementService.download($scope.model.provinceApproval.reportFileId).$promise.then(function (result) {
                                $scope.reportFileId = result.data.fileName;
                                $scope.copyReportFileId = angular.copy(result.data.fileName);
                            });
                        }
                        if ($scope.model.provinceApproval.licenseFileId) {
                            CurrencyReimbursementService.download($scope.model.provinceApproval.licenseFileId).$promise.then(function (result) {
                                $scope.licenseFileId = result.data.fileName;
                                $scope.copyLicenseFileId = angular.copy(result.data.fileName);
                            });
                        }
                        if ($scope.model.provinceApproval.permitFileId) {
                            CurrencyReimbursementService.download($scope.model.provinceApproval.permitFileId).$promise.then(function (result) {
                                $scope.permitFileId = result.data.fileName;
                                $scope.copyPermitFileId = angular.copy(result.data.fileName);
                            });
                        }

                        $scope.model.pcsell = $scope.model.pcsell + "";
                        var copy = angular.copy($scope.model);
                        if (!$scope.model.regionCode) {
                            return;
                        }
                        if ($scope.model.code) {
                            $scope.model.seq = $scope.model.code.substring(4, 7) ? $scope.model.code.substring(4, 7) : '';
                        }
                        if (res.data.screens)
                            $scope.hallNum = res.data.screens.length;
                        angular.forEach(res.data.screens, function (every) {
                            $scope.seatSum += every.seatCounts;
                        });
                        $scope.modelCopy = angular.copy($scope.model);
                    } else {
                        if (res.errors.length >= 0) {
                            angular.forEach(res.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "查询异常！");
                        }
                    }

                });
                $scope.hallNum = 0;
                $scope.seatSum = 0;
                $scope.seatCountsChange = function () {
                    $scope.seatSum = CurrencyReimbursementService.getSeatSum($scope.model.screens);
                    if (!$scope.seatSum) {
                        $scope.seatSum = 0;
                    }
                };


                var count = 0;
                $scope.compareCode = function (value) {
                    var flag = true;
                    if ($scope.flagInfo) {
                        ++count;
                        if (count == 4) {
                            $scope.flagInfo = false;
                            return flag;
                        }
                    } else {
                        for (var i = 0; i < $scope.model.screens.length; i++) {
                            if (value == $scope.model.screens[i].code) {
                                flag = false;
                                break;
                            }
                        }
                    }

                    return flag;
                };
                $scope.flag = true;
                //BEGIN 影厅表操作
                $scope.model.screens = [];
                //定义影厅表结构，方便动态添加操作
                var hallSchema = {
                    id: "",
                    cinemaCode: "",
                    code: "",
                    name: "",
                    seats: "",
                    projectorType: "",
                    projectorBrand: "",
                    projectorModel: "",
                    projectorNumber: "",
                    projectorResolution: "",
                    placement: "",
                    hallType: "",
                    disabled: null,

                    editing: true, //自定义字段，方便前端逻辑处理
                    deleting: false //自定义字段，方便前端逻辑处理
                };
                //动态添加影厅表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addHallElement = function (hallForm) {
                    if (hallForm.$valid) {
                        $scope.flag = true;
                        var editRecord = _.findWhere($scope.model.screens, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.screens.push(angular.copy(hallSchema));
                    }
                    $scope.hallNum = $scope.model.screens.length;
                };
                //删除影厅表记录，如果是原始数据，则置deleting=false；如果是新增的，则直接从页面删除
                $scope.deleteHallElement = function (index, hallModel) {
                    angular.forEach($scope.model.screens, function (value, key) {
                        value.editing = false;
                    });
                    $scope.model.screens.splice(index, 1);
                    $scope.hallNum = $scope.model.screens.length;
                    $scope.seatSum = CurrencyReimbursementService.getSeatSum($scope.model.screens);
                };
                //恢复已删除记录
                $scope.restoreHallElement = function (index, hallModel) {
                    hallModel.deleting = false;
                    hallModel.disabled = null;
                };
                //编辑记录
                $scope.editHallElement = function (index, hallModel, hallForm) {
                    if (hallForm.$invalid) return;
                    angular.forEach($scope.model.screens, function (value, key) {
                        if (index != key) {
                            value.editing = false;
                        }
                    });
                    hallModel.editing = true;
                    $scope.flag = false;
                    $scope.flagInfo = true;
                    count = 0;
                };

                //BEGIN 影院资本投资构成表操作
                $scope.model.shareholders = [];
                //定义影院资本投资构成表结构，方便动态添加操作
                var investmentSchema = {
                    name: "",
                    national: "",
                    ratio: "",
                    editing: true, //自定义字段，方便前端逻辑处理
                    deleting: false //自定义字段，方便前端逻辑处理
                };
                //动态添加影院资本投资构成表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addInvestmentElement = function (investmentForm) {
                    if ($scope.model.shareholders.length === 0) {
                        investmentForm.$valid = true;
                    }
                    if (investmentForm.$valid) {
                        var editRecord = _.findWhere($scope.model.shareholders, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.shareholders.push(angular.copy(investmentSchema));
                    }
                };
                //删除影院资本投资构成表记录，如果是原始数据，则置deleting=false；如果是新增的，则直接从页面删除
                $scope.deleteinvestmentElement = function (index, investmentModel) {
                    angular.forEach($scope.model.shareholders, function (value, key) {
                        value.editing = false;
                    });
                    $scope.model.shareholders.splice(index, 1);
                };
                //恢复已删除记录
                $scope.restoreinvestmentElement = function (index, investmentModel) {
                    investmentModel.deleting = false;
                };
                //编辑记录
                $scope.editinvestmentElement = function (index, investmentModel, investmentForm) {
                    if (investmentForm.$invalid) return;
                    angular.forEach($scope.model.shareholders, function (value, key) {
                        if (index != key) {
                            value.editing = false;
                        }
                    });
                    investmentModel.editing = true;
                };

                //备份
                $scope.modelCopy = {};
                $scope.hallModelListCopy = [];
                $scope.investmentModelListCopy = [];
                $scope.allCountys = [];

                $scope.hallNum = 0;
                $scope.seatSum = 0;
                $scope.model.record = [];
                //重置
                $scope.reset = function () {
                    $scope.model = angular.copy($scope.modelCopy);
                    $scope.hallNum = $scope.model.screens.length;
                    $scope.seatCountsChange();
                    $scope.getVersion();
                    $scope.reportFileId = angular.copy($scope.copyReportFileId);
                    $scope.licenseFileId = angular.copy($scope.copyLicenseFileId);
                    $scope.permitFileId = angular.copy($scope.copyPermitFileId);
                    // 将上传进度条隐藏
                    $scope.isShowUpload1 = false;
                    $scope.isShowUpload2 = false;
                    $scope.isShowUpload3 = false;
                    cinemaForm.$submitted = false;
                    hallForm.$submitted = false;
                    investmentForm.$submitted = false;
                };

                //提交处理
                //提交处理，页面存在三个表单，提交时，需对三个表单同时校验
                $scope.submit = function (cinemaForm, hallForm, investmentForm) {
                    //$.uniform.update();
                    cinemaForm.$submitted = true;
                    hallForm.$submitted = true;
                    investmentForm.$submitted = true;
                    //如果三个表单都校验通过，则发送请求
                    if (cinemaForm.$valid && hallForm.$valid && investmentForm.$valid) {
                        var totalRatio = 0;
                        for (var index in $scope.model.shareholders) {
                            totalRatio += parseInt($scope.model.shareholders[index].ratio);
                        }
                        if (totalRatio > 100) {
                            toastr.error("", "影院资本投资构成信息参股比例不能超过100！");
                            return;
                        }
                        var cinemaGradeDateType = _.find($scope.softwares, function (filmTypeObj) {
                            return filmTypeObj.id == $scope.model.softwareId;
                        });
                        if (cinemaGradeDateType) {
                            $scope.model.softwareName = cinemaGradeDateType.name;
                            $scope.model.vendorId = cinemaGradeDateType.id;
                        }
                        if ($scope.model.status == 'nationRejected') {
                            $scope.model.status = 'provinceApproved';
                        }
                        //如果主表成功，子表失败，修改后提交主表为修改
                        CurrencyReimbursementService.updateCinemaInfo($scope.model, $scope.model.id).$promise.then(function (result) {
                            if ('success' == result.status) {
                                //for (var i = 0; i < $scope.model.screens.length; i++) {
                                //    $scope.model.screens[i].cinemaCode = code;
                                //}
                                CurrencyReimbursementService.updateFirstPass($scope.model.provinceApproval).$promise.then(function (result) {
                                    if ('success' == result.status) {
                                        toastr.success("", "影院信息修改成功,并提交终审！");
                                        $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                                    } else {
                                        if (result.errors.length >= 0) {
                                            angular.forEach(result.errors, function (each) {
                                                toastr.error("", each.errmsg);
                                            });
                                        } else {
                                            toastr.error("", "修改信息失败！");
                                        }
                                    }
                                });

                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "影院基本信息修改失败！");
                                }
                            }
                        });
                    }
                };
                $scope.isShowUpload1 = false;
                $scope.isShowUpload2 = false;
                $scope.isShowUpload3 = false;
                $scope.uploadReportFileSuccess = function ($file, $message, $flow) {
                    $scope.isShowUpload1 = true;
                    var res = JSON.parse($message);
                    if ('success' == res.status) {
                        if ($flow.files && $flow.files.length > 1) {
                            $flow.files.splice(0, 1);
                        }
                        $scope.model.provinceApproval.reportFileId = res.data[0].id;
                        $scope.reportFileId = res.data[0].fileName;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        toastr.success("", "变更文件上传成功！");
                    } else {
                        if (res.errors.length >= 0) {
                            angular.forEach(res.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "变更文件上传失败！");
                        }
                    }

                };
                $scope.uploadLicenseFileSuccess = function ($file, $message, $flow) {
                    $scope.isShowUpload2 = true;
                    var res = JSON.parse($message);
                    if ('success' == res.status) {
                        if ($flow.files && $flow.files.length > 1) {
                            $flow.files.splice(0, 1);
                        }
                        $scope.model.provinceApproval.licenseFileId = res.data[0].id;
                        $scope.licenseFileId = res.data[0].fileName;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        toastr.success("", "变更文件上传成功！");
                    } else {
                        if (res.errors.length >= 0) {
                            angular.forEach(res.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "变更文件上传失败！");
                        }
                    }

                };
                $scope.uploadPermitFileSuccess = function ($file, $message, $flow) {
                    $scope.isShowUpload3 = true;
                    var res = JSON.parse($message);
                    if ('success' == res.status) {
                        if ($flow.files && $flow.files.length > 1) {
                            $flow.files.splice(0, 1);
                        }
                        $scope.model.provinceApproval.permitFileId = res.data[0].id;
                        $scope.permitFileId = res.data[0].fileName;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        toastr.success("", "变更文件上传成功！");
                    } else {
                        if (res.errors.length >= 0) {
                            angular.forEach(res.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "变更文件上传失败！");
                        }
                    }

                };
                $scope.uploadError = function ($file, $message, $flow) {

                };
                $scope.delFilePOne = function ($flow, file) {
                    $scope.model.provinceApproval.reportFileId = null;
                    $scope.reportFileId = "";
                    $flow.removeFile(file);
                };
                $scope.delFilePTwo = function ($flow, file) {
                    $scope.model.provinceApproval.licenseFileId = null;
                    $scope.licenseFileId = "";
                    $flow.removeFile(file);
                };
                $scope.delFileP = function ($flow, file) {
                    $scope.model.provinceApproval.permitFileId = null;
                    $scope.permitFileId = "";
                    $flow.removeFile(file);
                };
                //动态添加影院资本投资构成表记录，需要保证当前正在编辑的记录表单校验通过
                $scope.addInvestmentElement = function (investmentForm) {
                    if ($scope.model.shareholders.length === 0) {
                        investmentForm.$valid = true;
                    }
                    if (investmentForm.$valid) {
                        var editRecord = _.findWhere($scope.model.shareholders, {editing: true});
                        if (editRecord) {
                            editRecord.editing = false;
                        }
                        $scope.model.shareholders.push(angular.copy(investmentSchema));
                    }
                };
                /**
                 * 返回上一页
                 */
                $scope.return = function () {
                    $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                };
            }])
    .controller('CinemaSignUpAuditCheckController',
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
    .filter("provinceFilter", ["CurrencyReimbursementService", function (CurrencyReimbursementService) {
        return function (value) {
            var provinces = CurrencyReimbursementService.getAllProvinces();
            var province = _.find(provinces, function (province) {
                    return province.key == value;
                }
            );
            return province ? province.text : "";
        };
    }])
    .filter("countryKeyToName", ["DictService", function (DictService) {
        return function (value) {
            var resultData = DictService.get("country");
            var even = _.find(resultData, function (res) {
                    return res.key == value;
                }
            );
            return even ? even.text : "";
        };
        /**
         * 返回上一页
         */
        $scope.return = function () {
            $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
        };
    }])
    .filter("playUnitType", ["EnumService", function (EnumService) {
        return function (value) {
            var playUnitTypes = EnumService.get("playUnitType");
            var res = _.find(playUnitTypes, function (status) {
                    return status.key == value;
                }
            );
            return res ? res.text : "";
        };
    }])
    .filter("cinemaGradeDate", ["EnumService", function (EnumService) {
        return function (value) {
            var cinemaGradeDate = EnumService.get("cinemaGradeDate");
            var cinemaGradeDate = _.find(cinemaGradeDate, function (status) {
                    return status.key == value;
                }
            );
            return cinemaGradeDate ? cinemaGradeDate.text : "";
        };
    }])
    .filter("cinemaLevelDate", ["EnumService", function (EnumService) {
        return function (value) {
            var cinemaLevelDate = EnumService.get("cinemaLevelDate");
            var cinemaLevelDate = _.find(cinemaLevelDate, function (status) {
                    return status.key == value;
                }
            );
            return cinemaLevelDate ? cinemaLevelDate.text : "";
        };
    }])
    .filter("statusFilter", function () {
        return function (value) {
            if (value == 'nationApproved') {
                return "营业";
            } else if (value == 'provinceApproved') {
                return "测试阶段";
            } else {
                return "待审核";
            }
        };
    })
    .filter("statusEnumFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var statusData = EnumService.get("statusEnum");
            var status = _.find(statusData, function (status) {
                    return status.key == value;
                }
            );
            return status ? status.text : "";
        };
    }])
    .filter("testDataReportedCaseFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var data = EnumService.get("testDataReportedCase");
            var dataCase = _.find(data, function (dataCase) {
                    return dataCase.key == value;
                }
            );
            return dataCase ? dataCase.text : "";
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
    .filter("placementDateFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var placementDate = EnumService.get("placementDate");
            var placementDateType = _.find(placementDate, function (status) {
                    return status.key == value;
                }
            );
            return placementDateType ? placementDateType.text : "";
        }
    }])
    .filter("hallTypeDateFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var hallTypeDate = EnumService.get("hallTypeDate");
            var hallTypeDateType = _.find(hallTypeDate, function (status) {
                    return status.key == value;
                }
            );
            return hallTypeDateType ? hallTypeDateType.text : "";
        }
    }])
    .filter("booleanInfoFilter", function () {
        return function (value) {
            if (value) {
                return "已上报";
            } else if (value == false) {
                return "未上报";
            } else {
                return null;
            }
        }
    })
    .filter("booleanFilterTwo", function () {
        return function (value) {
            if (value) {
                return "是";
            } else if (value == false) {
                return "否";
            } else {
                return null;
            }
        }
    })
    .filter("signTypeFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var signType = EnumService.get("signType");
            var signTypeType = _.find(signType, function (status) {
                    return status.key == value;
                }
            );
            return signTypeType ? signTypeType.text : "";
        }
    }])
    .filter("firstResultFilter", ["EnumService", function (EnumService) {
        return function (value) {
            if (value) {
                return "通过";
            } else if (value == false) {
                return "不通过";
            } else {
                return "未审核";
            }
        }
    }])
    .filter("finalResultFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var finalResult = EnumService.get("finalResult");
            var finalResultType = _.find(finalResult, function (status) {
                    return status.key == value;
                }
            );
            return finalResultType ? finalResultType.text : "";
        }
    }])
    .filter("recordsTypeFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var finalResult = EnumService.get("recordsInfoType");
            var finalResultType = _.find(finalResult, function (status) {
                    return status.key == value;
                }
            );
            return finalResultType ? finalResultType.text : "";
        }
    }])
    .filter("companyTypeDate", ["EnumService", function (EnumService) {
        return function (value) {
            var companyTypeDate = EnumService.get("companyTypeDate");
            var companyTypeDate = _.find(companyTypeDate, function (status) {
                    return status.key == value;
                }
            );
            return companyTypeDate ? companyTypeDate.text : "";
        }
    }])
    .filter("placeTypeDate", ["EnumService", function (EnumService) {
        return function (value) {
            var placeTypeDate = EnumService.get("placeTypeDate");
            placeTypeDate = _.find(placeTypeDate, function (status) {
                    return status.key == value;
                }
            );
            return placeTypeDate ? placeTypeDate.text : "";
        }
    }])
    .filter("businessTypeScreenFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var typestr = "";
            if(value){
                var types = [];
                var hallTypeDate = EnumService.get("businessTypeScreen");
                angular.forEach(value, function(value, index) {
                    var type = _.find(hallTypeDate, function (status) {
                            return status.key == value;
                        }
                    );
                    types.push(type.text);
                });
                typestr = types.join(",");
            }


            return typestr;
        };
    }])
    .filter("businessStatusFilter", ["EnumService", function (EnumService) {
        return function (value) {
            var businessStatus = EnumService.get("originalHandmadeCinemaStatusData1");
            res = _.find(businessStatus, function (status) {
                    return status.key == value;
                }
            );
            return res ? res.text : "";
        }
    }])
;