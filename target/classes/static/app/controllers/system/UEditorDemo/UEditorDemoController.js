/**
 * Created by caoRN on 2016/11/11.
 * ueditorDEmo
 */
angular.module('MetronicApp').controller('UEditorDemoController',
    ['$rootScope', '$scope', '$location', 'toastr', 'UEditorDemoService',
        function ($rootScope, $scope, $location, toastr, UEditorDemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            $scope.config = {};//自定义文本编辑器的config设置
            UEditorDemoService.getUEditorData().$promise.then(function (result) {
                if ("success" == result.status) {
                    $scope.content = result.data.content;
                }
            });
            //ueditor加载完成事件
            $scope.ready = function () {
            }
        }]);