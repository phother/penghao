/**
 * Created by caoRN on 2016/11/10.
 * ngEchartsPie
 */
'use strict';
angular.module("MetronicApp").directive('ngEchartsPie', function () {
    return {
        template: "<div style='height: 400px'></div>",
        restrict: 'E',
        scope: {
            id: "@",
            data: "=",//数据源
            text: "@",//主标题
            subtext: "@",//附标题（灰）
            name: "@"//提示框title
        },
        replace: true,
        link: function ($scope, $element, $attrs) {
            var initOptions = function () {
                $scope.nameList = [];//颜色区划提示文字列表
                for (var index in $scope.data) {
                    $scope.nameList.push($scope.data[index].name);
                }
                return {
                    title: {
                        text: $scope.text,
                        subtext: $scope.subtext,
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: $scope.nameList//颜色区划方块
                    },
                    series: [
                        {
                            name: $scope.name,
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: $scope.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            };
            var myChart = echarts.init(document.getElementById($scope.id));
            myChart.setOption(initOptions());
            //动态监听数据的变化
            $scope.$watch('data', function (newVal, oldVal) {
                if (angular.equals(newVal, oldVal)) {
                    return;
                }
                myChart.setOption(initOptions());
            }, true);
        }
    };
});

