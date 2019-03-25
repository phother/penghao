/**
 * Created by caoRN on 2016/11/18.
 * AngularFullCalendarDemoController
 */
angular.module('MetronicApp').controller('AngularFullCalendarDemoController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'uiCalendarConfig', 'AngularFullCalendarDemoService',
        function ($rootScope, $scope, $location, $uibModal, toastr, uiCalendarConfig, AngularFullCalendarDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            //数据源,可以是数组、函数、对象
            $scope.events = [];
            $scope.eventsF = function (start, end, timezone, callback) {
                AngularFullCalendarDemoService.getFullCalendarData().$promise.then(function (result) {
                    if ('success' == result.status) {
                        angular.forEach(result.data, function (data) {
                            if (data.end) {
                                data.end = new Date(data.end * 1000);
                            }
                            data.start = new Date(data.start * 1000);
                        });
                        callback(result.data);
                    }
                });
            };
            $scope.calEventsExt = {
                color: 'pink',
                textColor: 'gray',
                events: function (start, end, timezone, callback) {
                    AngularFullCalendarDemoService.getFullCalendarData().$promise.then(function (result) {
                        if ('success' == result.status) {
                            angular.forEach(result.data, function (data) {
                                if (data.end) {
                                    data.end = new Date(data.end * 1000);
                                }
                                data.start = new Date(data.start * 1000);
                            });
                            callback(result.data);
                        }
                    });
                }
            };

            //实例化fullCalendar控件
            $scope.fullCalendar = function () {
                $scope.uiConfig = {
                    calendar: {
                        header: {
                            left: 'month agendaWeek agendaDay',
                            center: 'title',
                            right: 'today prev,next'
                        },
                        height: 550,
                        editable: true,// 默认值false, 用来设置日历中的日程是否可以编辑
                        weekMode: "liquid",//月视图中一共显示多少周fixed、liquid、variable
                        allDayText: "全天",
                        axisFormat: "HH:mm",
                        timeFormat: "HH:mm",
                        dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        buttonText: {
                            today: '返回今天',
                            month: '月视图',
                            week: '周视图',
                            day: '日视图'
                        },
                        firstDay: 0,
                        dayClick: $scope.alertDayClick,
                        eventClick: $scope.alertEventOnClick,
                        eventDrop: $scope.alertOnDrop,
                        eventResize: $scope.alertOnResize
                    }
                };
            };

            //单机日期单元格事件
            $scope.alertDayClick = function (dayDate, allDay, jsEvent, view) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'addFullCalendar.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.model = {allDay: true};
                        scope.model.fullStratTime = dayDate._d;//初始化开始时间
                        scope.model.fullEndTime = dayDate._d;//初始化结束时间
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
                    AngularFullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            $scope.events.push({
                                title: model.fullContent,
                                start: model.fullStratTime,
                                end: model.fullEndTime,
                                allDay: model.allDay
                            });
                            angular.element("#calendar").fullCalendar("refetchEvents");//重新渲染整个日程表
                            toastr.success("", "日程添加成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "日程添加失败");
                            }
                        }
                    });
                });
            };

            //单机日程事件
            $scope.alertEventOnClick = function (calEvent, jsEvent, view) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'editFullCalendar.html',
                    controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                        scope.model = {id: calEvent.id, allDay: calEvent.allDay};
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
                                AngularFullCalendarDemoService.FullCalendarDelete(id).$promise.then(function (res) {
                                    if ('success' == res.status) {
                                        angular.element("#calendar").fullCalendar("refetchEvents");//重新渲染整个日程表
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
                    AngularFullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (result) {
                        if ("success" == result.status) {
                            angular.element("#calendar").fullCalendar("refetchEvents");//重新渲染整个日程表
                            toastr.success("", "日程修改成功。");
                        } else {
                            for (var index in result.errors) {
                                toastr.error(result.errors[index].errmsg, "日程修改失败");
                            }
                        }
                    });
                });
            };

            //拖动事件，修改日程时间范围
            $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
                var model = {
                    action: "drag",//动作
                    id: event.id,
                    daydiff: delta._days,//相对于原来的时间+N或者-N天
                    minudiff: delta._milliseconds//时间上的变化+N或者-N分钟
                };
                AngularFullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (res) {
                    if ('success' == res.status) {
                        angular.element("#calendar").fullCalendar("refetchEvents");
                    } else {
                        revertFunc(); //恢复原状
                        for (var index in res.errors) {
                            toastr.error(res.errors[index].errmsg, "请求失败");
                        }
                    }
                });
            };

            //日程事件的缩放，修改日程时间范围
            $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
                var model = {
                    action: "resize",
                    id: event.id,
                    daydiff: delta._days,
                    minudiff: delta._milliseconds
                };
                AngularFullCalendarDemoService.FullCalendarDrag(model).$promise.then(function (res) {
                    if ('success' == res.status) {
                        angular.element("#calendar").fullCalendar("refetchEvents");
                    } else {
                        for (var index in res.errors) {
                            toastr.error(res.errors[index].errmsg, "请求失败");
                        }
                        revertFunc(); //恢复原状
                    }
                });
            };

            $scope.eventSources = [$scope.eventsF, $scope.events];//数据双向绑定
            $scope.fullCalendar();//调用实例化

        }]);