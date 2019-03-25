/**
 * Created by caoRN on 2016/11/10.
 * ngEchartsLine
 */
'use strict';
angular.module("MetronicApp").directive('ngEchartsLine', function () {
    return {
        template: '<div style="height:400px"></div>',
        restrict: 'E',
        scope: {
            id: "@",
            item: "=",//数据源，每项的数值
            data: "=",//x轴的提示文字，即统计的分类
            text: "@",//主标题
            subtext: "@"//附标题（灰）
        },
        replace: true,
        link: function ($scope, $element, $attrs) {
            var initOptions = function () {
                var dataAxis = $scope.data;
                var data = $scope.item;
                var yMax = 1000;
                var dataShadow = [];
                for (var i = 0; i < data.length; i++) {
                    dataShadow.push(yMax);
                }
                return {
                    title: {
                        text: $scope.text,
                        subtext: $scope.subtext
                    },
                    tooltip: {
                        //提示框触发类型，默认（'item'）数据触发，可选为：'item' | 'axis'
                        trigger: 'item'
                    },
                    xAxis: {
                        data: dataAxis,
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: '#999'
                            },
                            rotate: 40,//倾斜角度
                            interval: 0
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        z: 10
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999'
                            }
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    series: [
                        { // For shadow
                            type: 'bar',
                            itemStyle: {
                                normal: {color: 'rgba(0,0,0,0.05)'}
                            },
                            barGap: '-100%',
                            barCategoryGap: '40%',
                            data: dataShadow
                        },
                        {
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#83bff6'},
                                            {offset: 0.5, color: '#188df0'},
                                            {offset: 1, color: '#188df0'}
                                        ]
                                    ),
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                    }
                                },
                                emphasis: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            {offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                            data: data
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

            $scope.$watch('item', function (newVal, oldVal) {
                if (angular.equals(newVal, oldVal)) {
                    return;
                }
                myChart.setOption(initOptions());
            }, true);

        }
    };
});
