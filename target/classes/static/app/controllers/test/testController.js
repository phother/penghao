angular.module('MetronicApp').controller('testController',
    ['$rootScope', '$scope', '$location', 'toastr', '$controller', "testService", "$uibModal",
        function ($rootScope, $scope, $location, toastr, $controller, testService) {

            $scope.options = {
                module: "test",
                service: "testService",
                schema: [
                    {type: "checkbox", sortable: false},
                    {name: 'userName', label: '用户名', sortable: true},
                    {name: 'nickName', label: '名称', sortable: true},
                    {name: 'age', label: '年龄', sortable: true},
                    {name: 'gender', label: '性别', sortable: true, filter: "genderFilter"},
                    {name: 'createDate', label: '创建时间', sortable: true, filter: "timestampToTime"},
                    {name: 'roleNamesList', label: '角色名', sortable: false, filter: "roleNamesFilter"},
                    {name: 'discard', label: '状态', sortable: true, filter: "platformFilter"},
                    {label: '操作', sortable: false, width: 240, type: 'template', templateUrl: 'operation.html'}
                ],
                searchParams: {
                    userName: $scope.userName
                }
            };
            $controller("BaseController", {$scope: $scope});

            $scope.passwordEdit = function (id) {
                $location.path("/system/platformUser/password.html").search({"id": id});
            };


        }]).controller('testEditController',
    ['$rootScope', '$scope', '$location', 'EnumService', '$controller',
        function ($rootScope, $scope, $location, EnumService, $controller) {
            $scope.genderDatas = EnumService.get("genderType");
            $scope.options = {
                "module": "test"
            };
            $controller("formController", {$scope: $scope});
        }
    ]
).filter("platformFilter", function () {
    return function (value) {
        if (value) {
            return "启用";
        } else {
            return "禁用";
        }
    }
}).filter("roleNamesFilter", function () {
    return function (value) {
        var str = "";
        for (var index in value) {
            str += value[index] + "  ";
        }
        return str;
    }
}).filter("genderFilter", ["EnumService", function (EnumService) {
    var genderDatas = EnumService.get("genderType");
    return function (value) {
        var even = _.find(genderDatas, {"key": value});
        return even ? even.text : value;
    }
}]);
