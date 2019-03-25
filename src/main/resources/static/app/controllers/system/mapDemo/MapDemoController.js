/**
 * Created by caoRN on 2016/11/15.
 * MapDemoController
 */
angular.module('MetronicApp').controller('MapDemoController',
    ['$rootScope', '$scope', '$location', 'toastr', 'MapDemoService',
        function ($rootScope, $scope, $location, toastr, MapDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            //初始化地图，基本设置百度地图API功能,此操作会有延迟，设置初始化坐标时最好接近于当前位置
            $scope.mapInstance = function () {
                var map = new BMap.Map("allmap");//实例化
                var point = new BMap.Point(116.331398, 39.897445);//初始坐标
                map.centerAndZoom(point, 15);//初始显示比例
                map.enableScrollWheelZoom(); //启用滚轮放大缩小
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        var mk = new BMap.Marker(r.point);
                        map.addOverlay(mk);
                        map.panTo(r.point);
                        console.log('当前坐标：' + r.point.lng + ',' + r.point.lat);
                    }
                    else {
                        toastr.error('', 'failed' + this.getStatus());
                    }
                }, {enableHighAccuracy: true, maximumAge: 1000});//是否高精度 & 刷新间隔
            };
            $scope.mapInstance();
        }]);