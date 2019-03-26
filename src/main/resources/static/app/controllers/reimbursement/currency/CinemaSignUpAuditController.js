angular.module("MetronicApp").controller('CinemaSignUpAuditController',
    ['$rootScope', '$scope', '$location', '$timeout', 'EnumService', 'cinemaSignUpAuditBatchDeleteService', 'cinemaSignUpAuditService', '$window', 'DictService', 'toastr',
        function ($rootScope, $scope, $location, $timeout, EnumService, cinemaSignUpAuditBatchDeleteService, cinemaSignUpAuditService, $window, DictService, toastr) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                $rootScope.settings.layout.pageBodySolid = true;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.model = {};
            //ng-table about
            $scope.columns = cinemaSignUpAuditService.getSchema();
            $scope.sort = cinemaSignUpAuditService.getSort();
            $scope.order = cinemaSignUpAuditService.getOrder();
            $scope.pageable = cinemaSignUpAuditService.getPageable();

            //method of fetch list data
            $scope.list = function () {
                cinemaSignUpAuditService.list(function (result) {
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
                cinemaSignUpAuditService.setSize(newVal);
                cinemaSignUpAuditService.setStoredPage(0);
                $scope.searchForWatch();
            });
            //fetch data when the number of pages changed
            $scope.$watch('pageable.number', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                cinemaSignUpAuditService.setStoredPage(newVal);
                $scope.searchForWatch();
            });
            //fetch data when the sort or order changed
            $scope.$watch('sort', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                cinemaSignUpAuditService.setSort(newVal);
                $scope.searchForWatch();
            });
            $scope.$watch('order', function (newVal, oldVal) {
                if (newVal == oldVal) return;
                cinemaSignUpAuditService.setOrder(newVal);
                $scope.searchForWatch();
            });

            //search
            $scope.search = function () {
                // cinemaSignUpAuditService.setAndClearFunction();
                // cinemaSignUpAuditService.putSearchParams({
                // });

                $scope.list();
            };
            //search
            $scope.searchForWatch = function () {
                cinemaSignUpAuditService.putSearchParams({
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
                cinemaSignUpAuditService.putSearchParams(searchable);
                cinemaSignUpAuditService.setStoredPage(0);
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
                cinemaSignUpAuditService.getBatchDelete(modelInfo).$promise.then(function (res) {
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
            $scope.delete = function (cinemaApplicationId) {
                $scope.cinemaApplicationIdInfo = cinemaApplicationId;
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

                cinemaSignUpAuditService.exportExcelfileInfo(searchable);
            };

        }])
    .controller('CinemaSignUpAuditCreateController',
        ['$rootScope', '$scope', '$location', 'toastr', 'cinemaSignUpAuditService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, cinemaSignUpAuditService, DictService, EnumService) {
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
                    cinemaSignUpAuditService.getForm(id).$promise.then(function (res) {
                        $scope.model = res.data;
                        angular.forEach(res.data.details, function (every) {
                            $scope.seatSum += every.remiburseMoney;
                        });
                    });
                }


                $scope.hallNum = 0;
                $scope.seatSum = 0;

                $scope.seatCountsChange = function () {
                    $scope.seatSum = cinemaSignUpAuditService.getSeatSum($scope.model.details);
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

                        cinemaSignUpAuditService.save($scope.model).$promise.then(function (result) {
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
                    $scope.seatSum = cinemaSignUpAuditService.getSeatSum($scope.model.details);
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
        ['$rootScope', '$scope', '$location', 'toastr', 'cinemaSignUpAuditService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, cinemaSignUpAuditService, DictService, EnumService) {
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

                cinemaSignUpAuditService.getAllRegions().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.allRegions = result.data;
                    }
                });

                cinemaSignUpAuditService.getAllProvince().$promise.then(function (result) {
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
                    cinemaSignUpAuditService.getAllProvinces($scope.model.regionCode).$promise.then(function (result) {
                        if ('success' == result.status) {
                            $scope.allProvinces = result.data;

                        }
                    });
                };

                $scope.getCity = function () {
                    $scope.model.cityCode = '';
                    $scope.model.countyCode = '';
                    if ($scope.model.provinceCode) {
                        cinemaSignUpAuditService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $scope.allCitys = result.data;
                            }
                        });
                        cinemaSignUpAuditService.getRegionByProvinceCode($scope.model.provinceCode).$promise.then(function (result){
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
                        cinemaSignUpAuditService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
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
                cinemaSignUpAuditService.softwareUrl().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.softwares = result.data;
                        cinemaSignUpAuditService.getForm(cinemaApplicationId).$promise.then(function (result) {
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
                                    cinemaSignUpAuditService.softwareVersionUrl($scope.model.softwareName).$promise.then(function (result) {
                                        if ('success' == result.status) {
                                            $scope.softwareVersions = result.data;
                                            $scope.model.softwareVersion = angular.copy(softwareVersionTemp);
                                        }
                                    });
                                }
                                cinemaSignUpAuditService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
                                    if ('success' == result.status) {
                                        $scope.allCountys = result.data;
                                        $scope.model.provinceCode = modelCopy.provinceCode;
                                    }
                                });
                                cinemaSignUpAuditService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                                    if ('success' == result.status) {
                                        $scope.allCitys = result.data;
                                        $scope.model.cityCode = modelCopy.cityCode;
                                    }
                                });
                                cinemaSignUpAuditService.getAllProvince().$promise.then(function (result) {
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
                //$scope.getInfo =function(){
                //    cinemaSignUpAuditService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
                //        if ('success' == result.status) {
                //            $scope.allCountys = result.data;
                //            $scope.model.provinceCode = modelCopy.provinceCode;
                //        }
                //    });
                //    cinemaSignUpAuditService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                //        if ('success' == result.status) {
                //            $scope.allCitys = result.data;
                //            $scope.model.cityCode = modelCopy.cityCode;
                //        }
                //    });
                //    cinemaSignUpAuditService.getAllProvinces($scope.model.regionCode).$promise.then(function (result) {
                //        if ('success' == result.status) {
                //            $scope.allProvinces = result.data;
                //            $scope.model.countyCode = modelCopy.countyCode;
                //        }
                //    });
                //};
                // cinemaSignUpAuditService.getAllRegions().$promise.then(function (result) {
                //     if ('success' == result.status) {
                //         $scope.allRegions = result.data;
                //         cinemaSignUpAuditService.getForm(cinemaApplicationId).$promise.then(function (res) {
                //             $scope.model = res.data;
                //             $scope.model.pcsell = $scope.model.pcsell + "";
                //             var copy = angular.copy($scope.model);
                //             if (!$scope.model.regionCode) {
                //                 return;
                //             }
                //             if ($scope.model.code) {
                //                 $scope.model.seq = $scope.model.code.substring(4, 7) ? $scope.model.code.substring(4, 7) : '';
                //             }
                //             cinemaSignUpAuditService.getAllProvinces($scope.model.regionCode).$promise.then(function (result) {
                //                 if ('success' == result.status) {
                //                     $scope.allProvinces = result.data;
                //                     $scope.model.provinceCode = copy.provinceCode;
                //                 }
                //             });
                //             if (!$scope.model.provinceCode) {
                //                 return;
                //             }
                //             cinemaSignUpAuditService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                //                 if ('success' == result.status) {
                //                     $scope.allCitys = result.data;
                //                     $scope.model.cityCode = copy.cityCode;
                //                 }
                //             });
                //             if ($scope.model.cityCode) {
                //                 cinemaSignUpAuditService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
                //                     if ('success' == result.status) {
                //                         $scope.allCountys = result.data;
                //                         $scope.model.countyCode = copy.countyCode;
                //                     }
                //                 });
                //             }
                //             $scope.hallNum = res.data.screens.length;
                //             angular.forEach(res.data.screens, function (every) {
                //                 $scope.seatSum += every.seatCounts;
                //             });
                //             $scope.modelCopy = angular.copy($scope.model);
                //         });
                //
                //     }
                // });
                // $scope.getProvince = function () {
                //     $scope.model.provinceCode = '';
                //     $scope.model.cityCode = '';
                //     $scope.model.countyCode = '';
                //     if (!$scope.model.regionCode) {
                //         return;
                //     }
                //     cinemaSignUpAuditService.getAllProvinces($scope.model.regionCode).$promise.then(function (result) {
                //         if ('success' == result.status) {
                //             $scope.allProvinces = result.data;
                //         }
                //     });
                // };
                //
                // $scope.getCity = function () {
                //     $scope.model.cityCode = '';
                //     $scope.model.countyCode = '';
                //     if (!$scope.model.provinceCode) {
                //         return;
                //     }
                //     cinemaSignUpAuditService.getAllCitys($scope.model.provinceCode).$promise.then(function (result) {
                //         if ('success' == result.status) {
                //             $scope.allCitys = result.data;
                //         }
                //     });
                // };
                // $scope.getCount = function () {
                //     $scope.model.countyCode = '';
                //     if (!$scope.model.cityCode) {
                //         return;
                //     }
                //     if ($scope.model.cityCode) {
                //         cinemaSignUpAuditService.getAllCountys($scope.model.cityCode).$promise.then(function (result) {
                //             if ('success' == result.status) {
                //                 $scope.allCountys = result.data;
                //             }
                //         });
                //     }
                // };
                $scope.getVersionTemp = function () {
                    if ($scope.model.softwareName) {
                        cinemaSignUpAuditService.softwareVersionUrl($scope.model.softwareName).$promise.then(function (result) {
                            if ('success' == result.status) {
                                $scope.softwareVersions = result.data;
                            }
                        });

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
                //    $scope.softwareVersions = [];
                //    var res = _.find($scope.softwares, function (status) {
                //        return status.id == $scope.model.softwareId;
                //    });
                //    if (res) {
                //        $scope.model.softwareName = res.name;
                //        $scope.model.softwareVendorId = res.softwareVendorId;
                //        $scope.softwareVersions = [{
                //            "softwareVersion": res.versionNumber,
                //            "softwareVersion": res.versionNumber
                //        }];
                //    }
                //};
                $scope.countryOptions = DictService.get('country');

                //$scope.model = {};
                cinemaSignUpAuditService.getCreateCinemaChain().$promise.then(function (result) {
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
                    $scope.seatSum = cinemaSignUpAuditService.getSeatSum($scope.model.screens);
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
                        cinemaSignUpAuditService.updateCinema($scope.model, $scope.model.id).$promise.then(function (result) {
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
                    $scope.seatSum = cinemaSignUpAuditService.getSeatSum($scope.model.screens);
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
        ['$rootScope', '$scope', '$location', 'toastr', 'cinemaSignUpAuditService', 'DictService', 'EnumService',
            function ($rootScope, $scope, $location, toastr, cinemaSignUpAuditService, DictService, EnumService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });

                $scope.cinemaChains = [];

                cinemaSignUpAuditService.getCreateCinemaChain().$promise.then(function (result) {
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
                cinemaSignUpAuditService.softwareUrl().$promise.then(function (result) {
                    if ('success' == result.status) {
                        $scope.softwares = result.data;
                    }
                });
                $scope.getVersion = function () {
                    if ($scope.model.softwareName) {
                        cinemaSignUpAuditService.softwareVersionUrl($scope.model.softwareName).$promise.then(function (result) {
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
                cinemaSignUpAuditService.getForm(cinemaApplicationId).$promise.then(function (res) {
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
                            cinemaSignUpAuditService.download($scope.model.provinceApproval.reportFileId).$promise.then(function (result) {
                                $scope.reportFileId = result.data.fileName;
                                $scope.copyReportFileId = angular.copy(result.data.fileName);
                            });
                        }
                        if ($scope.model.provinceApproval.licenseFileId) {
                            cinemaSignUpAuditService.download($scope.model.provinceApproval.licenseFileId).$promise.then(function (result) {
                                $scope.licenseFileId = result.data.fileName;
                                $scope.copyLicenseFileId = angular.copy(result.data.fileName);
                            });
                        }
                        if ($scope.model.provinceApproval.permitFileId) {
                            cinemaSignUpAuditService.download($scope.model.provinceApproval.permitFileId).$promise.then(function (result) {
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
                    $scope.seatSum = cinemaSignUpAuditService.getSeatSum($scope.model.screens);
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
                    $scope.seatSum = cinemaSignUpAuditService.getSeatSum($scope.model.screens);
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
                        cinemaSignUpAuditService.updateCinemaInfo($scope.model, $scope.model.id).$promise.then(function (result) {
                            if ('success' == result.status) {
                                //for (var i = 0; i < $scope.model.screens.length; i++) {
                                //    $scope.model.screens[i].cinemaCode = code;
                                //}
                                cinemaSignUpAuditService.updateFirstPass($scope.model.provinceApproval).$promise.then(function (result) {
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
        ['$rootScope', '$scope', '$location', 'cinemaSignUpAuditService', 'DictService', '$timeout', 'EnumService', 'toastr',
            function ($rootScope, $scope, $location, cinemaSignUpAuditService, DictService, $timeout, EnumService, toastr) {
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
                cinemaSignUpAuditService.getForm(cinemaApplicationId).$promise.then(function (res) {
                    $scope.model = res.data;
                    angular.forEach(res.data.details, function (every) {
                        $scope.seatSum += every.remiburseMoney;
                    });
                });

                $scope.return = function () {
                    $location.path('/reimbursement/currency/list.html').search({storeParam:true});
                };

            }])

    .controller('CinemaSignUpAuditShowSeatController',
        ['$rootScope', '$scope', '$location', 'cinemaSignUpAuditService',
            function ($rootScope, $scope, $location, cinemaSignUpAuditService) {
                $scope.$on('$viewContentLoaded', function () {
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });
                $scope.cinemaApplicationId = $location.search().cinemaApplicationId;
                $scope.status = $location.search().status;


                $scope.goToLast = function () {
                    $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/check.html').search({
                        id: $scope.cinemaApplicationId,
                        status: $scope.status,
                        storeParam:true
                    });
                };

                $scope.cinemaCode = $location.search().cinemaCode;
                $scope.screenCode = $location.search().screenCode;

                cinemaSignUpAuditService.getCinemaScreenSeat($scope.cinemaCode, $scope.screenCode).$promise.then(function (res) {
                    if (res.status == 'success') {
                        var seatInfo = res.data;

                        if (seatInfo) {
                            var seatsArray = eval(seatInfo);
                            var seat = {}, $seatCav = $(".s_seat");
                            seat.imgPath = '../../../../../../views/bits/generalBusiness/cinemaManagement/cinemaInfoSearch/';
                            seat.srcSale = "seat.png";
                            seat.selectedSeatInfo = "{}";

                            seat.curHover = {};
                            seat.selected = [];
                            seat.rowArray = [];
                            seat.colArray = [];
                            var x_max = parseInt(seatsArray[0]["x"]);
                            var y_max = parseInt(seatsArray[0]["y"]);
                            for (var i = 1; i < seatsArray.length; i++) {
                                if (parseInt(seatsArray[i]["x"]) > x_max) {
                                    x_max = parseInt(seatsArray[i]["x"]);
                                }
                                if (parseInt(seatsArray[i]["y"]) > y_max) {
                                    y_max = parseInt(seatsArray[i]["y"]);
                                }
                            }
                            seat.numX = x_max;//seatsArray[seatsArray.length-1]["x"];
                            seat.numY = y_max;//seatsArray[seatsArray.length-1]["y"];
                            seat.rowWidth = 50;
                            seat.colHeight = 30;
                            seat.cavGapTop = 10;
                            seat.cavWidth = $seatCav.width() - seat.rowWidth;
                            seat.seatWidth = Math.floor(seat.cavWidth / seat.numY);
                            if (seat.seatWidth > 30) {
                                seat.seatWidth = 30;
                                $seatCav.html("<div class=\'pewlist\' style=\'width: " + (seat.seatWidth * seat.numY + seat.rowWidth) + "px;\'</div>");
                                $seatCav = $(".s_seat .pewlist");
                            } else if (seat.seatWidth < 16) {
                                seat.seatWidth = 16;
                            }
                            seat.seatHeight = seat.seatWidth;
                            seat.cavHeight = seat.seatHeight * seat.numX + seat.colHeight + seat.cavGapTop;
                            $seatCav.html("").css("height", seat.cavHeight + "px");
                            function getSeatSrc(status, type) {
                                var src = seat.imgPath + "seat.png";
                                return src;
                                switch (type) {
                                    case "danren" :
                                        src = seat.imgPath + "seat.png";
                                        break;           // 0，可售
                                    case "Zhendong" :
                                        src = seat.imgPath + "seat_peh.png";
                                        break;     // 4，震动
                                    case "Couple" :
                                        src = seat.imgPath + "seat_pea.png";
                                        break;       // 5，情侣
                                    case "road" :
                                        src = seat.imgPath + "seat_pef.png";
                                        break;         // 7，过道
                                    case "MemCouple" :
                                        src = seat.imgPath + "seat_pea.png";
                                        break;    // 8，memcache存储的情侣
                                }
                                switch (status) {
                                    case "hover" :
                                        src = seat.imgPath + "seat_pee.png";
                                        break;
                                    case "CanSell" :
                                        break;     // 0，可售
                                    case "Selled" :             // 1，已售
                                    case "locked" :
                                        src = seat.imgPath + "seat_ped.png";
                                        break;            // 2，锁定
                                    case "repair" :
                                        src = seat.imgPath + "seat_ped.png";
                                        break;       // 3，维修
                                    case "Selected" :
                                        src = seat.imgPath + "seat_pee.png";
                                        break;     // 6，已选
                                }
                                return src;
                            }

                            $.each(seatsArray, function (i, s) {
                                var seat_param = {};
                                seat_param.width = seat.seatWidth;
                                seat_param.height = seat.seatHeight;
                                seat_param.left = (s.y - 1) * seat.seatWidth + seat.rowWidth;
                                seat_param.top = (s.x - 1) * seat.seatHeight + seat.cavGapTop;
                                var seat_src = getSeatSrc(s.status, s.type);
                                if (s.type == "road") {
                                    $("<b>").css(seat_param)
                                        .addClass("road")
                                        .appendTo($seatCav);
                                } else {
                                    $("<img>").attr({
                                            "src": seat_src,
                                            "type": s.type,
                                            "status": s.status,
                                            "sid": s.seat_id,
                                            "id": "seat_" + s.x + "_" + s.y,
                                            "title": s.row_value + "排" + s.column_value + "号"
                                        })
                                        .css(seat_param)
                                        .addClass("seat" + (s.status == "ok" ? " ok" : ""))
                                        .appendTo($seatCav);
                                }
                                seat.rowArray[s.x - 1] = seat.rowArray[s.x - 1] && seat.rowArray[s.x - 1] != "0" ? seat.rowArray[s.x - 1] : s.row_value;
                                seat.colArray[s.y - 1] = s.y;
                            });
                            //排号提示
                            $.each(seat.rowArray, function (i, r) {
                                var row_param = {};
                                //srow_param.width = seat.rowWidth;
                                row_param.height = seat.seatHeight;
                                row_param.left = 0;
                                row_param.top = i * seat.seatHeight + seat.cavGapTop;
                                row_param.lineHeight = (seat.seatHeight + 6) + "px";
                                $("<span>").html(r + "排")
                                    .css(row_param)
                                    .addClass("row")
                                    .appendTo($seatCav);
                            });
                            //座号提示
                            $.each(seat.colArray, function (i, c) {
                                var row_param = {};
                                row_param.width = seat.seatWidth;
                                row_param.height = seat.colHeight;
                                row_param.left = i * seat.seatWidth + seat.rowWidth;
                                row_param.top = seat.numX * seat.seatHeight + seat.cavGapTop;
                                row_param.lineHeight = seat.colHeight + "px";
                                $("<span>").html(c < 10 ? "0" + c : c)
                                    .css(row_param)
                                    .addClass("col")
                                    .appendTo($seatCav);
                            });
                        }
                    }
                });
                $scope.return = function () {
                    $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                };
            }])
    .controller('CinemaSignUpAuditFirstController',
        ['$rootScope', '$scope', '$location', '$resource', 'toastr', 'DictService', 'cinemaSignUpAuditService', 'EnumService', 'cinemaSignUpAuditService',
            function ($rootScope, $scope, $location, $resource, toastr, DictService, cinemaSignUpAuditService, EnumService, cinemaSignUpAuditService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });

                var code = $location.search().code;
                var cinemaApplicationId = $location.search().cinemaApplicationId;
                $scope.countryOptions = DictService.get('country');

                //获取枚举类型
                $scope.placeTypeOptions = EnumService.get("placeTypeDate");
                $scope.companyTypeDateOptions = EnumService.get("companyTypeDate");

                $scope.approveModel = {
                    id: "",
                    cinemaCode: code,
                    firstResult: "",
                    firstView: "",
                    firstTime: ""
                };

                $scope.hallNum = 0;
                $scope.seatSum = 0;
                cinemaSignUpAuditService.getForm(cinemaApplicationId).$promise.then(function (res) {
                    $scope.model = res.data;
                    $scope.hallNum = res.data.screens.length;
                    angular.forEach(res.data.screens, function (every) {
                        $scope.seatSum += every.seatCounts;
                    });
                    // $scope.model.seq = $scope.model.code.substring(4,7)?$scope.model.code.substring(4,7):'';
                    $scope.model.nationApprovalModel = $scope.model.nationApproval;
                    $scope.model.provinceApprovalModel = $scope.model.provinceApproval;
                    // $scope.model.provinceApprovalModel.code = $scope.model.code;
                    if ($scope.model.code) {
                        $scope.model.seq = $scope.model.code.substring(4, 7) ? $scope.model.code.substring(4, 7) : '';
                    } else {
                        cinemaSignUpAuditService.getSeq($scope.model.cityCode, $scope.model.playUnitType).$promise.then(function (result) {
                            if ('success' == result.status) {
                                var newSeq = result.data.seq;
                                if (newSeq.length == 1) {
                                    $scope.model.seq = "0" + "0" + newSeq;
                                } else if (newSeq.length == 2) {
                                    $scope.model.seq = "0" + newSeq;
                                } else {
                                    $scope.model.seq = newSeq;
                                }
                                $scope.cinemaCode();
                            }
                        });
                    }
                });

                $scope.playUnitTypeOptions = EnumService.get("playUnitType");

                $scope.cinemaCode = function () {
                    var d = $scope.model.playUnitType;
                    var data = _.find($scope.playUnitTypeOptions, function (data) {
                            return data.key == d;
                        }
                    );
                    $scope.model.codeInfo = $scope.model.newCityCode ? $scope.model.newCityCode.substring(0, 4) + $scope.model.seq + data.value : "";
                    $scope.model.seq = $scope.model.codeInfo.substring(4, 7) ? $scope.model.codeInfo.substring(4, 7) : '';
                };


                $scope.changeSeq = function () {
                    if ($scope.model.seq) {
                        if (($scope.model.seq).length == 3) {
                            var index = $scope.model.codeInfo.substring(7, 8);
                            $scope.model.codeInfo = "";
                            $scope.model.codeInfo = ($scope.model.newCityCode).substring(0, 4) + $scope.model.seq + index;
                        }
                    }
                };

                $scope.isPass = function (firstResult, cinemaForm) {
                    cinemaForm.$submitted = true;
                    $scope.model.provinceApprovalModel.first_passed = firstResult;
                    if ($scope.model.code) {
                        $scope.model.provinceApprovalModel.code = $scope.model.code;
                    } else {
                        $scope.model.provinceApprovalModel.code = $scope.model.codeInfo;
                    }
                    if ((firstResult) && (!$scope.model.provinceApprovalModel.reportFileId || !$scope.model.provinceApprovalModel.licenseFileId || !$scope.model.provinceApprovalModel.permitFileId)) {
                        toastr.error('', '请将影院审批明细附件上传完整！');
                        return
                    }
                    if (firstResult && cinemaForm.$valid) {
                        cinemaSignUpAuditService.updateFirstPass($scope.model.provinceApprovalModel).$promise.then(function (result) {
                            if ('success' == result.status) {

                                $resource("bits/w/cinemas/s?page=0&size=10&s_cinemaCode=" + result.data.code + "&s_showHistory=false&sort=id,desc").save().$promise.then(function (codeResult) {
                                    if ('success' == codeResult.status) {
                                        var reportFile = {};
                                        var licenseFile = {};
                                        var permitFile = {};
                                        reportFile.provinceName = $scope.model.provinceName;
                                        reportFile.cinemaCode = result.data.code;
                                        reportFile.cinemaName = $scope.model.shortName;
                                        reportFile.cinemaChainName = $scope.model.cinemaChainName;
                                        reportFile.cinemaId = codeResult.data[0].cinemaId;
                                        reportFile.type = "provinceCinemaRegister";
                                        reportFile.name = $scope.reportFileId;
                                        reportFile.documentId = result.data.reportFileId;
                                        licenseFile.provinceName = $scope.model.provinceName;
                                        licenseFile.cinemaCode = result.data.code;
                                        licenseFile.cinemaName = $scope.model.shortName;
                                        licenseFile.cinemaChainName = $scope.model.cinemaChainName;
                                        licenseFile.cinemaId = codeResult.data[0].cinemaId;
                                        ;
                                        licenseFile.type = "legalPersonBusinessLicence";
                                        licenseFile.name = $scope.licenseFileId;
                                        licenseFile.documentId = result.data.licenseFileId;
                                        permitFile.provinceName = $scope.model.provinceName;
                                        permitFile.cinemaCode = result.data.code;
                                        permitFile.cinemaName = $scope.model.shortName;
                                        permitFile.cinemaChainName = $scope.model.cinemaChainName;
                                        permitFile.cinemaId = codeResult.data[0].cinemaId;
                                        ;
                                        permitFile.type = "projectionPermit";
                                        permitFile.name = $scope.permitFileId;
                                        permitFile.documentId = result.data.permitFileId;
                                        cinemaSignUpAuditService.saveDocument(reportFile).$promise.then(function (res) {
                                            if ('success' == res.status) {
                                                toastr.success("", "【影院基本信息注册表】文档保存成功！");
                                            }
                                        });
                                        cinemaSignUpAuditService.saveDocument(licenseFile).$promise.then(function (res) {
                                            if ('success' == res.status) {
                                                toastr.success("", "【企业法人营业执照】文档保存成功！");
                                            }
                                        });
                                        cinemaSignUpAuditService.saveDocument(permitFile).$promise.then(function (res) {
                                            if ('success' == res.status) {
                                                toastr.success("", "【放映许可证】文档保存成功！");
                                            }
                                        });
                                        toastr.success('', '初审通过并且提交成功');
                                        $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                                    }
                                });
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "初审提交失败！");
                                }
                            }
                        });
                    } else if (!firstResult && cinemaForm.$valid) {
                        cinemaSignUpAuditService.updateFirstPass($scope.model.provinceApprovalModel).$promise.then(function (result) {
                            if ('success' == result.status) {
                                toastr.success('', '初审未通过并且提交成功');
                                $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "初审提交失败！");
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
                    var result = JSON.parse($message);
                    if ('success' == result.status) {
                        if ($flow.files && $flow.files.length > 1) {
                            $flow.files.splice(0, 1);
                        }
                        $scope.model.provinceApprovalModel.reportFileId = result.data[0].id;
                        $scope.reportFileId = result.data[0].fileName;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        toastr.success("", "上传文件成功！");
                    } else {
                        if (result.errors.length >= 0) {
                            angular.forEach(result.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "上传文件失败！");
                        }
                    }
                };
                $scope.uploadLicenseFileSuccess = function ($file, $message, $flow) {
                    $scope.isShowUpload2 = true;
                    var result = JSON.parse($message);
                    if ('success' == result.status) {
                        if ($flow.files && $flow.files.length > 1) {
                            $flow.files.splice(0, 1);
                        }
                        $scope.model.provinceApprovalModel.licenseFileId = result.data[0].id;
                        $scope.licenseFileId = result.data[0].fileName;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        toastr.success("", "上传文件成功！");
                    } else {
                        if (result.errors.length >= 0) {
                            angular.forEach(result.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "上传文件失败！");
                        }
                    }

                };
                $scope.uploadPermitFileSuccess = function ($file, $message, $flow) {
                    $scope.isShowUpload3 = true;
                    var result = JSON.parse($message);
                    if ('success' == result.status) {
                        if ($flow.files && $flow.files.length > 1) {
                            $flow.files.splice(0, 1);
                        }
                        $scope.model.provinceApprovalModel.permitFileId = result.data[0].id;
                        $scope.permitFileId = result.data[0].fileName;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        toastr.success("", "上传文件成功！");
                    } else {
                        if (result.errors.length >= 0) {
                            angular.forEach(result.errors, function (each) {
                                toastr.error("", each.errmsg);
                            });
                        } else {
                            toastr.error("", "上传文件失败！");
                        }
                    }

                };
                $scope.uploadError = function ($file, $message, $flow) {

                };
                $scope.delFilePOne = function ($flow, file) {
                    $scope.model.provinceApprovalModel.reportFileId = null;
                    $scope.reportFileId = "";
                    $flow.removeFile(file);
                };
                $scope.delFilePTwo = function ($flow, file) {
                    $scope.model.provinceApprovalModel.licenseFileId = null;
                    $scope.licenseFileId = "";
                    $flow.removeFile(file);
                };
                $scope.delFileP = function ($flow, file) {
                    $scope.model.provinceApprovalModel.permitFileId = null;
                    $scope.permitFileId = "";
                    $flow.removeFile(file);
                };

                //$scope.uploadReportFileSuccess = function ($file, $message, $flow) {
                //    var res = JSON.parse($message);
                //    if (res.status == 'success') {
                //        $scope.model.provinceApprovalModel.reportFileId = res.data[0].id;
                //    } else {
                //        if (res.errors.length >= 0) {
                //            angular.forEach(res.errors, function (each) {
                //                toastr.error("", each.errmsg);
                //            });
                //        } else {
                //            toastr.error("", "查询异常！");
                //        }
                //    }
                //};
                //$scope.uploadLicenseFileSuccess = function ($file, $message, $flow) {
                //    var res = JSON.parse($message);
                //    if (res.status == 'success') {
                //        $scope.model.provinceApprovalModel.licenseFileId = res.data[0].id;
                //    } else {
                //        if (res.errors.length >= 0) {
                //            angular.forEach(res.errors, function (each) {
                //                toastr.error("", each.errmsg);
                //            });
                //        } else {
                //            toastr.error("", "查询异常！");
                //        }
                //    }
                //};
                //$scope.uploadPermitFileSuccess = function ($file, $message, $flow) {
                //    var res = JSON.parse($message);
                //    if (res.status == 'success') {
                //        $scope.model.provinceApprovalModel.permitFileId = res.data[0].id;
                //    } else {
                //        if (res.errors.length >= 0) {
                //            angular.forEach(res.errors, function (each) {
                //                toastr.error("", each.errmsg);
                //            });
                //        } else {
                //            toastr.error("", "查询异常！");
                //        }
                //    }
                //};
                //$scope.uploadError = function ($file, $message, $flow) {
                //
                //};
                /**
                 * 返回上一页
                 */
                $scope.return = function () {
                    $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                };
            }])
    .controller('CinemaSignUpAuditLastController',
        ['$rootScope', '$scope', '$location', 'toastr', 'DictService', 'cinemaSignUpAuditService', 'EnumService', 'cinemaSignUpAuditService',
            function ($rootScope, $scope, $location, toastr, DictService, cinemaSignUpAuditService, EnumService, cinemaSignUpAuditService) {
                $scope.$on('$viewContentLoaded', function () {
                    // initialize core components
                    Metronic.initAjax();
                    $rootScope.settings.layout.pageBodySolid = true;
                    $rootScope.settings.layout.pageSidebarClosed = false;
                });

                var cinemaApplicationId = $location.search().cinemaApplicationId;
                $scope.countryOptions = DictService.get('country');

                //获取枚举类型
                $scope.placeTypeOptions = EnumService.get("placeTypeDate");
                $scope.companyTypeDateOptions = EnumService.get("companyTypeDate");

                $scope.downloadreportFile = function () {
                    cinemaSignUpAuditService.downloadfile($scope.model.provinceApproval.reportFileId, $scope.reportFileId);
                };
                $scope.downloadlicenseFile = function () {
                    cinemaSignUpAuditService.downloadfile($scope.model.provinceApproval.licenseFileId, $scope.licenseFileId);
                };
                $scope.downloadpermitFile = function () {
                    cinemaSignUpAuditService.downloadfile($scope.model.provinceApproval.permitFileId, $scope.permitFileId);
                };

                $scope.hallNum = 0;
                $scope.seatSum = 0;
                cinemaSignUpAuditService.getForm(cinemaApplicationId).$promise.then(function (res) {
                    $scope.model = res.data;
                    cinemaSignUpAuditService.download($scope.model.provinceApproval.reportFileId).$promise.then(function (result) {
                        $scope.reportFileId = result.data.fileName;
                    });
                    cinemaSignUpAuditService.download($scope.model.provinceApproval.licenseFileId).$promise.then(function (result) {
                        $scope.licenseFileId = result.data.fileName;
                    });
                    cinemaSignUpAuditService.download($scope.model.provinceApproval.permitFileId).$promise.then(function (result) {
                        $scope.permitFileId = result.data.fileName;
                    });
                    $scope.hallNum = res.data.screens.length;
                    angular.forEach(res.data.screens, function (every) {
                        $scope.seatSum += every.seatCounts;
                    });
                    $scope.model.seq = $scope.model.code.substring(4, 7) ? $scope.model.code.substring(4, 7) : '';
                });

                $scope.isPass = function (finalResult) {
                    $scope.model.nationApproval.secondapp_passed = finalResult;
                    if (finalResult) {
                        cinemaSignUpAuditService.updateFinallyPass($scope.model.nationApproval).$promise.then(function (result) {
                            if ('success' == result.status) {
                                toastr.success('', '终审通过并且提交成功');
                                toastr.warning('', '注意：请在最少半小时后再提交统计报文');
                                $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "终审提交失败！");
                                }
                            }
                        });
                    } else {
                        cinemaSignUpAuditService.updateFinallyPass($scope.model.nationApproval).$promise.then(function (result) {
                            if ('success' == result.status) {
                                toastr.success('', '终审未通过并且提交成功');
                                $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                            } else {
                                if (result.errors.length >= 0) {
                                    angular.forEach(result.errors, function (each) {
                                        toastr.error("", each.errmsg);
                                    });
                                } else {
                                    toastr.error("", "终审提交失败！");
                                }
                            }
                        });
                    }
                };
                $scope.signTypeOptions = EnumService.get("signType");
                //返回上一页
                $scope.return = function () {
                    $location.path('/generalBusiness/cinemaManagement/cinemaSignUpAudit/list.html').search({storeParam:true});
                };
            }])
    .filter("provinceFilter", ["cinemaSignUpAuditService", function (cinemaSignUpAuditService) {
        return function (value) {
            var provinces = cinemaSignUpAuditService.getAllProvinces();
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