(function (angular) {
    function TravelExpenseService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'depId', label: '部门', sortable: false},
            {name: 'name', label: '姓名', sortable: false},
            {name: 'reimburseTime', label: '日期',filter:"timestampToDate"},
            {name: '操作', label: '操作', type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.currencyReimburses.listUrl, UrlConfigService.urlConfig.currencyReimburses.saveUrl, $resource, $q, $http, _schema);
        this._formUrl = UrlConfigService.urlConfig.currencyReimburses.formUrl;
        this._schema = _schema;

        this.getSeatSum = function (hallModelList) {
            var seatSum = 0;
            for (var hallModel in hallModelList) {
                seatSum += parseFloat(hallModelList[hallModel].trafficeFee);
            }
            return seatSum;
        };

        this.getTrafficeFeeSum = function (hallModelList) {
            var trafficeFee = 0;
            for (var hallModel in hallModelList) {
                trafficeFee += parseFloat(hallModelList[hallModel].trafficeFee);
            }
            return trafficeFee;
        };

        this.getForm = function (id) {
            return $resource(this._formUrl,{id:id}).get();
        };
    }

    TravelExpenseService.prototype = Object.create(BaseListService.prototype);
    TravelExpenseService.$inject = ['$resource', '$q', '$http', 'UrlConfigService','FileStorageService'];

    angular.module('MetronicApp').service('TravelExpenseService', TravelExpenseService);
})(angular);
