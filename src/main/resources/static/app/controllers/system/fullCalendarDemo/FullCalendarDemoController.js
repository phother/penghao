/**
 * Created by caoRN on 2016/11/16.
 * FullCalendarDemoController
 */
angular.module('MetronicApp').controller('FullCalendarDemoController',
    ['$rootScope', '$scope', '$location', 'toastr', '$uibModal', 'FullCalendarDemoService',
        function ($rootScope, $scope, $location, toastr, $uibModal, FullCalendarDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            //实例化fullCalendar控件
            $scope.fullCalendar = function () {
                angular.element('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    allDayText: "全天",
                    axisFormat: "HH:mm",
                    minTime: "8:00",
                    maxTime: "18:00",
                    timeFormat: "HH:mm",
                    firstDay: 0,
                    editable: true, // 默认值false, 用来设置日历中的日程是否可以编辑
                    weekMode: "variable",//月视图中一共显示多少周fixed、liquid、variable
                    events: function (start, end, timezone) {
                        //数据源，很重要
                        FullCalendarDemoService.getFullCalendarData().$promise.then(function (result) {
                            if ('success' == result.status) {
                                timezone(result.data)
                            }
                        });
                    },
                    //点击日期单元格事件，新增日程
                    dayClick: function (dayDate, allDay, jsEvent, view) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'addFullCalendar.html',
                            controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                                scope.model = {};
                                scope.model.fullStratTime = dayDate;//初始化开始时间
                                scope.model.fullEndTime = dayDate;//初始化结束时间
                                scope.btn_ok = function (form) {
                                    form.$submitted = true;
                                    if (form.$valid) {
                                        $uibModalInstance.close(scope.model);
                                    }
                                };
                                scope.btn_cancel = function () {
                                    $uibModalInstance.dismiss();
                                };
                            }]
                        });
                        modalInstance.result.then(function (model) {
                            model.action = "add";
                            FullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (result) {
                                if ("success" == result.status) {
                                    $('#calendar').fullCalendar('updateEvent', event);//刷新当前的日程事件
                                    $("#calendar").fullCalendar("refetchEvents");//重新渲染整个日程表
                                    toastr.success("", "日程添加成功。");
                                } else {
                                    for (var index in result.errors) {
                                        toastr.error(result.errors[index].errmsg, "日程添加失败");
                                    }
                                }
                            });
                        });
                    },
                    //单机日程事件，删除或者修改日程
                    eventClick: function (calEvent, jsEvent, view) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'editFullCalendar.html',
                            controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                                scope.model = {id: calEvent.id};
                                scope.model.fullContent = calEvent.title;
                                scope.model.fullStratTime = calEvent._start;//初始化开始时间
                                scope.model.fullEndTime = calEvent._start;//初始化结束时间
                                if (calEvent._end) {
                                    scope.model.fullEndTime = calEvent._end;
                                }
                                scope.btn_ok = function (form) {
                                    form.$submitted = true;
                                    if (form.$valid) {
                                        $uibModalInstance.close(scope.model);
                                    }
                                };
                                scope.btn_cancel = function () {
                                    $uibModalInstance.dismiss();
                                };
                                scope.btn_del = function (form) {
                                    $uibModalInstance.dismiss();
                                    var modalInstance = $uibModal.open({
                                        templateUrl: 'confirm.html',
                                        controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                                            scope.confirmContent = "确认删除该日程吗？";
                                            scope.btn_ok = function () {
                                                $uibModalInstance.close(calEvent.id);
                                            };
                                            scope.btn_cancel = function () {
                                                $uibModalInstance.dismiss();
                                            };
                                        }]
                                    });
                                    modalInstance.result.then(function (id) {
                                        FullCalendarDemoService.FullCalendarDelete(id).$promise.then(function (res) {
                                            if ('success' == res.status) {
                                                $("#calendar").fullCalendar("refetchEvents");//重新渲染整个日程表
                                                toastr.success('', '删除日程成功！')
                                                $uibModalInstance.dismiss();
                                            } else {
                                                for (var index in res.errors) {
                                                    toastr.error(res.errors[index].errmsg, "日程删除失败");
                                                }
                                            }
                                        });
                                    });
                                }
                            }]
                        });
                        modalInstance.result.then(function (model) {
                            model.action = "edit";
                            FullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (result) {
                                if ("success" == result.status) {
                                    $("#calendar").fullCalendar("refetchEvents");//重新渲染整个日程表
                                    toastr.success("", "日程修改成功。");
                                } else {
                                    for (var index in result.errors) {
                                        toastr.error(result.errors[index].errmsg, "日程修改失败");
                                    }
                                }
                            });
                        });
                    },
                    //拖动事件，修改日程时间范围
                    eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
                        var model = {
                            action: "drag",//动作
                            id: event.id,
                            daydiff: dayDelta,//相对于原来的时间+N或者-N天
                            minudiff: minuteDelta,//时间上的变化+N或者-N分钟
                            allday: allDay
                        };
                        FullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (res) {
                            if ('success' == res.status) {
                                $('#calendar').fullCalendar('updateEvent', event);
                                $("#calendar").fullCalendar("refetchEvents");
                            } else {
                                for (var index in res.errors) {
                                    toastr.error(res.errors[index].errmsg, "请求失败");
                                }
                                revertFunc(); //恢复原状
                            }
                        });
                    },
                    //日程事件的缩放，修改日程时间范围
                    eventResize: function (event, dayDelta, minuteDelta, revertFunc) {
                        var model = {
                            action: "resize",
                            id: event.id,
                            daydiff: dayDelta,
                            minudiff: minuteDelta
                        };
                        FullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (res) {
                            if ('success' == res.status) {
                                $('#calendar').fullCalendar('updateEvent', event);
                                $("#calendar").fullCalendar("refetchEvents");
                            } else {
                                for (var index in res.errors) {
                                    toastr.error(res.errors[index].errmsg, "请求失败");
                                }
                                revertFunc(); //恢复原状
                            }
                        });
                    },
                    //选取多天
                    select: function (startDate, endDate, allDay, jsEvent, view) {
                        alert('这个我不知道啥意思，暂时没触发过');
                        // var start =$.fullCalendar.formatDate(startDate,'yyyy-MM-dd');
                        // var end =$.fullCalendar.formatDate(endDate,'yyyy-MM-dd');
                    }
                });
                //日期下拉菜单的绑定
                angular.element("#fc-dateSelect").delegate("select", "change", function () {
                    var fcsYear = angular.element("#fcs_date_year").val();
                    var fcsMonth = angular.element("#fcs_date_month").val();
                    angular.element("#calendar").fullCalendar('gotoDate', fcsYear, fcsMonth);
                });
            };

            $scope.fullCalendar();
        }]);