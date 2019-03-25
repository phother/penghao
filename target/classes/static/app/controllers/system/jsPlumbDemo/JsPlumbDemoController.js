/**
 * Created by caoRN on 2016/11/18.
 * JsPlumbDemoController
 */
angular.module('MetronicApp').controller('JsPlumbDemoController',
    ['$rootScope', '$scope', '$location', '$uibModal', 'toastr', 'JsPlumbDemoService',
        function ($rootScope, $scope, $location, $uibModal, toastr, JsPlumbDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            // 请求的数据,可根据当前id取出对应的数据
            JsPlumbDemoService.getData().$promise.then(function (result) {
                //解析数据
                if ("success" == result.status) {
                    $scope.taskSummaryList = result.data.task;
                    $scope.routerList = result.data.router;
                    $scope.cyclicStorage();//循环存储
                }
            });
            $scope.taskSummaryList = [];
            $scope.routerList = [];

            //判断遍历存储函数
            $scope.cyclicStorage = function () {
                $scope.startList = [];
                $scope.taskList = [];
                $scope.endList = [];
                $scope.concurrentShuntList = [];
                $scope.selectiveShuntList = [];
                $scope.concurrentConvergenceList = [];
                $scope.selectConfluenceList = [];
                angular.forEach($scope.taskSummaryList, function (data) {
                    if (data.type == 'start') {
                        $scope.startList.push(data);
                    } else if (data.type == 'end') {
                        $scope.endList.push(data);
                    } else if (data.type == 'task') {
                        $scope.taskList.push(data);
                    } else if (data.type == 'concurrentShunt') {
                        $scope.concurrentShuntList.push(data);
                    } else if (data.type == 'selectiveShunt') {
                        $scope.selectiveShuntList.push(data);
                    } else if (data.type == 'concurrentConvergence') {
                        $scope.concurrentConvergenceList.push(data);
                    } else if (data.type == 'selectConfluence') {
                        $scope.selectConfluenceList.push(data);
                    }
                })
            };
            $scope.cyclicStorage();

            $scope.count = 0;
            // 判断页面是否加载完毕
            $scope.repeatFinish = function () {
                $scope.count++;
                if ($scope.count >= 3) {
                    //动态设置初始DOM的位置
                    angular.forEach($scope.taskSummaryList, function (data) {
                        $('#' + data.id).css('top', data.location.top).css('left', data.location.left);
                    });
                    $scope.jsPlumbInit();
                    $scope._initConnection();
                    $scope._configContextMenu();
                }
            };
            // jsplumb配置函数
            $scope.jsPlumbInit = function () {
                jsPlumb.ready(function () {
                    $scope.instance = jsPlumb.getInstance({
                        Connector: "Straight",
                        DragOptions: {cursor: 'pointer'},
                        Endpoint: ["Dot", {radius: 0.001}],
                        ConnectionOverlays: [
                            ["Arrow", {
                                location: 1,
                                id: "arrow",
                                length: 14,
                                foldback: 0.8
                            }],
                            ["Label", {label: "", id: "label", cssClass: "aLabel"}]//这个是鼠标拉出来的线的属性
                        ],
                        Container: 'Content-Main'
                    });
                    //线上单机事件，单机解绑
                    $scope.instance.bind("click", function (c) {
                        //连接到容器后弹窗确认数据的来源
                        var modalInstance = $uibModal.open({
                            templateUrl: 'confirm.html',
                            controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                                scope.confirmContent = "确定删除连接？";
                                scope.btn_ok = function () {
                                    $scope.instance.detach(c);//解绑
                                    $uibModalInstance.dismiss();//关闭窗口
                                };
                                scope.btn_cancel = function () {
                                    $uibModalInstance.dismiss();
                                    return;
                                };
                            }]
                        });

                    });
                    $scope.dom = angular.element(".item");//获取对象节点
                    //获取节点成功后需要调用的函数
                    if ($scope.dom.length > 0) {
                        $scope._makeSource($scope.dom);
                        $scope._makeTarget($scope.dom);
                    }
                    //连线成功的事件回调
                    $scope.instance.bind("connection", function (params, e) {
                        $('body').css('cursor', 'default');
                        var conn = params.connection;
                        var category = $('#' + conn.sourceId).attr('category');
                        conn.scope = conn.source.scope;
                        conn.target.scope = conn.source.scope;
                        if (category == 'concurrentShunt' || category == 'selectiveShunt' || category == 'concurrentConvergence' || category == 'selectConfluence') {
                            conn.source.scope = $('#' + conn.sourceId).attr('category');
                            conn.target.scope = $('#' + conn.sourceId).attr('category');
                        }
                        if ($scope.judge(params)) {
                            $scope.instance.detach(conn, {fireEvent: false});//解绑
                        }
                        angular.forEach($scope.taskSummaryList, function (res) {
                            if (res.id == params.source.id) {
                                //当连接成功后，动态修改label
                                params.connection.getOverlay("label").setLabel(res.details.task);
                            }
                        })
                    });
                });
            };
            //初始化连接状态显示，初始的DOM显示
            $scope._initConnection = function () {
                angular.forEach($scope.routerList, function (data) {
                    $scope.instance.connect({
                        source: data.source,
                        target: data.target
                    });
                });
            };
            // makeSource
            $scope._makeSource = function ($el) {
                $scope._draggable($el);
                angular.forEach($el, function (dom) {
                    if ($(dom).attr('category') == 'concurrentShunt' || $(dom).attr('category') == 'selectiveShunt') {
                        $scope.instance.makeSource(dom, {
                            filter: ".ep",
                            anchor: "Continuous",
                            connectorStyle: {
                                strokeStyle: "#5c96bc",
                                lineWidth: 2,
                                outlineColor: "transparent",
                                outlineWidth: 4
                            },
                            maxConnections: 5,
                            onMaxConnections: function () {
                                alert("maxconnections");
                            }
                        })
                    } else {
                        $scope.instance.makeSource(dom, {
                            filter: ".ep",
                            anchor: "Continuous",
                            connectorStyle: {
                                strokeStyle: "#5c96bc",
                                lineWidth: 2,
                                outlineColor: "transparent",
                                outlineWidth: 4
                            },
                            maxConnections: 1,
                            onMaxConnections: function () {
                                alert("maxconnections");
                            }
                        })
                    }

                })
            };
            // makeTarget
            $scope._makeTarget = function ($el) {
                $scope._draggable($el);
                angular.forEach($el, function (dom) {
                    if ($(dom).attr('category') == 'concurrentConvergence' || $(dom).attr('category') == 'selectConfluence') {
                        $scope.instance.makeTarget(dom, {
                            anchor: "Continuous",
                            paintStyle: {fillStyle: "green"},
                            maxConnections: 5,
                            onMaxConnections: function () {
                                alert("maxconnections");
                            }
                        })
                    } else {
                        $scope.instance.makeTarget(dom, {
                            anchor: "Continuous",
                            paintStyle: {fillStyle: "green"},
                            maxConnections: 1,
                            onMaxConnections: function () {
                                alert("maxconnections");
                            }
                        })
                    }
                })
            };
            // 拖拽函数，元素可拖拽
            $scope._draggable = function ($el) {
                $scope.instance.draggable($el, {
                    containment: "#Content-Main"
                });
            };
            //设置左侧DOM拖动添加
            angular.element(".basic").draggable({
                helper: "clone",
                zIndex: 10,
                revert: "invalid",
                start: function (e) {
                    $scope._initDroppable(e.currentTarget.id, e.currentTarget.innerText);
                }
            });
            //左侧箭头单机事件（连线）
            $scope.cursorChange = false;
            $scope.connection = function () {
                $scope.cursorChange = !$scope.cursorChange;
                if (!$scope.cursorChange) {
                    $('body').css('cursor', 'e-resize');
                } else {
                    $('body').css('cursor', 'default');

                }
                console.log($scope.cursorChange)
            };
            //关于拖放盒子的设置
            $scope._initDroppable = function (type, name) {
                $("#Content-Main").droppable({
                    drop: function (event, ui) {
                        $scope.$apply(function () {
                            $scope.addData = {
                                "id": new Date().getTime(),
                                "name": name,
                                "type": type,
                                "location": {
                                    "top": ui.offset.top,
                                    "left": ui.offset.left
                                },
                                "details": {
                                    "task": '',
                                    "role": ''
                                }
                            };
                            $scope.taskSummaryList.push($scope.addData);//添加新的元素
                            $scope.cyclicStorage();//调用循环存储函数
                            $scope.repeatFinish = function () {
                                $scope.dom = angular.element($('#' + $scope.addData.id + ''));
                                //确定添加元素定位
                                $scope.coordinateJudgment($scope.dom);
                                $scope._draggable($scope.dom);
                                $scope._makeSource($scope.dom);
                                $scope._makeTarget($scope.dom);
                            };
                        });
                    }
                })
            };

            //坐标判断函数,动态设置DOM坐标
            $scope.coordinateJudgment = function (dom) {
                var top = $scope.addData.location.top - $('#' + $scope.addData.id).parent().offset().top;
                var left = $scope.addData.location.left - $('#' + $scope.addData.id).parent().offset().left;
                var parentTop = $('#' + $scope.addData.id).parent().outerHeight() - dom.outerHeight();
                var parentleft = $('#' + $scope.addData.id).parent().outerWidth() - dom.outerWidth();
                console.log("top:" + top + "left:" + left + "parentTop:" + parentTop + "parentleft:" + parentleft)
                if (top < 0) {
                    top = 0;
                }
                if (left < 0) {
                    left = 0;
                }
                if (top > parentTop) {
                    top = parentTop;
                }
                if (left > parentleft) {
                    left = parentleft;
                }
                dom.css('top', top).css('left', left);
            };
            //判断连线的函数
            $scope.judge = function (params) {
                var targetCategory = $('#' + params.targetId).attr('category');
                var sourceCategory = $('#' + params.sourceId).attr('category');
                var targetJudge;
                var sourceJudge;
                if (targetCategory == 'concurrentShunt' || targetCategory == 'selectiveShunt' || targetCategory == 'concurrentConvergence' || targetCategory == 'selectConfluence') {
                    targetJudge = true;
                } else {
                    targetJudge = false;
                }
                if (sourceCategory == 'concurrentShunt' || sourceCategory == 'selectiveShunt' || sourceCategory == 'concurrentConvergence' || sourceCategory == 'selectConfluence') {
                    sourceJudge = true;
                } else {
                    sourceJudge = false;
                }
                if (params.targetId == params.sourceId) {
                    alert('Oneself cannot connect oneself!');
                    return true;
                } else if (targetCategory == 'start') {
                    alert('Start can not be used as target!');
                    return true;
                } else if (sourceCategory == 'end') {
                    alert('End can not be used as source!');
                    return true;
                } else if (targetJudge && sourceJudge) {
                    alert('Can not directly connect the shunt and confluence!');
                    return true;
                } else if ((sourceCategory == 'start' && targetJudge) || (targetCategory == 'end' && sourceJudge || sourceCategory == 'start' && targetCategory == 'end' )) {
                    alert('Not connected to the task!');
                    return true;
                } else if ((params.source.scope != 'concurrentShunt' && targetCategory == 'concurrentConvergence') || (params.source.scope != 'selectiveShunt' && targetCategory == 'selectConfluence')) {
                    alert('Shunt convergence does not match!');
                    return true;
                } else if ((params.source.scope == 'concurrentShunt' || params.source.scope == 'selectiveShunt') && (targetCategory == 'end' || targetCategory == 'concurrentShunt' || targetCategory == 'selectiveShunt')) {
                    alert('Please Convergence!');
                    return true;
                }
            };
            // 右键菜单函数，引用jquery.contextmenu的js以及css
            $scope._configContextMenu = function () {
                $.contextMenu('destroy');
                $.contextMenu({
                    selector: '.item',
                    build: function ($trigger, e) {
                        menu = {items: {"delete": {name: "delete", icon: "delete"}}};
                        menu.items.delete.callback = function () {
                            var modalInstance = $uibModal.open({
                                templateUrl: 'confirm.html',
                                controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                                    scope.confirmContent = "确定删除该节点？";
                                    scope.btn_ok = function () {
                                        $scope.instance.remove($trigger.context.id);//删除节点和连线
                                        for (var i = 0; i < $scope.taskSummaryList.length; i++) {
                                            if ($trigger.context.id == $scope.taskSummaryList[i].id) {
                                                $scope.taskSummaryList.splice(i, 1);
                                            }
                                        }
                                        $uibModalInstance.dismiss();//关闭窗口
                                    };
                                    scope.btn_cancel = function () {
                                        $uibModalInstance.dismiss();
                                        return;
                                    };
                                }]
                            });
                        };
                        if ($trigger.attr("category") == 'task') {
                            menu.items.edit = {
                                name: "edit",
                                icon: "edit",
                                callback: function () {
                                    var modalInstance = $uibModal.open({
                                        templateUrl: 'edit.html',
                                        controller: ["$scope", "$uibModalInstance", function (scope, $uibModalInstance) {
                                            scope.confirmContent = "";
                                            scope.editText = {};
                                            angular.forEach($scope.taskSummaryList, function (res) {
                                                if (res.id == $trigger.context.id) {
                                                    scope.editText = {
                                                        nodeName: res.name,
                                                        action: res.details.task,
                                                        role: res.details.role
                                                    }
                                                }
                                            });
                                            scope.btn_ok = function () {
                                                angular.forEach($scope.taskSummaryList, function (data) {
                                                    if (data.id == $trigger.context.id) {
                                                        data.details.task = scope.editText.action;
                                                        data.details.role = scope.editText.role;
                                                    }
                                                    angular.forEach($scope.instance.getAllConnections(), function (conn) {
                                                        if (conn.sourceId == data.id) {
                                                            conn.getOverlay("label").setLabel(data.details.task);
                                                        }
                                                    });
                                                });
                                                $uibModalInstance.dismiss();//关闭窗口
                                            };
                                            scope.btn_cancel = function () {
                                                $uibModalInstance.dismiss();
                                                return;
                                            };
                                        }]
                                    });
                                }
                            };
                        }
                        return menu;
                    }
                });
            };
            //保存函数
            $scope.save = function () {
                var conn = $scope.instance.getAllConnections();
                var data = {};
                var router = [];
                for (var i = 0; i < conn.length; i++) {
                    router.push({
                        source: conn[i].sourceId,
                        target: conn[i].targetId,
                        condition: {}
                    });
                }
                angular.forEach($scope.taskSummaryList, function (data) {
                    data.location.top = $('#' + data.id).position().top;
                    data.location.left = $('#' + data.id).position().left;
                });
                data.router = router;
                data.task = $scope.taskSummaryList;
                JsPlumbDemoService.save(data);
            }
        }]);