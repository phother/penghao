(function (angular) {
    function TravelExpenseService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'depName', label: '部门', sortable: false},
            {name: 'name', label: '姓名', sortable: false},
            {name: 'projectName', label: '项目名称'},
            {name: 'reimburseTime', label: '日期',filter:"timestampToDate"},
            // {name: 'totalMoney', label: '金额'},
            {name: '操作', label: '操作', type: 'template', templateUrl: 'operation.html'}
        ];

        this._url = UrlConfigService.urlConfig.travelExpense.url;
        this._searchListUrl = UrlConfigService.urlConfig.travelExpense.listUrl;
        this._userDeptUrl = UrlConfigService.urlConfig.system.platformUser.getUserDeptUrl;
        this._schema = _schema;


        BaseListService.call(this, this._searchListUrl, this._url, $resource, this._schema);

        this.getSeatSum = function (hallModelList) {
            var seatSum = 0;
            for (var hallModel in hallModelList) {
                seatSum += parseFloat(hallModelList[hallModel].trafficeFee);
            }
            return seatSum;
        };

        this.getTrafficeFeeSum = function (hallModelList) {
            let trafficeFee = 0;
            for (var hallModel in hallModelList) {
                trafficeFee += parseFloat(hallModelList[hallModel].trafficeFee);
            }
            return trafficeFee;
        };
        this.getUserDept = function () {
            return $resource(this._userDeptUrl).get();
        }
        this.getForm = function (id) {
            return $resource(this._url,{id:id}).get();
        };
    }

    TravelExpenseService.prototype = Object.create(BaseListService.prototype);
    TravelExpenseService.$inject = ['$resource', '$q', '$http', 'UrlConfigService','FileStorageService'];

    angular.module('MetronicApp').service('TravelExpenseService', TravelExpenseService);
})(angular);
