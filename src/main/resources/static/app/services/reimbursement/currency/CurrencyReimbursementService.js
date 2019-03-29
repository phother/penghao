(function (angular) {
    function CurrencyReimbursementService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'depId', label: '部门', sortable: false},
            {name: 'name', label: '姓名', sortable: false},
            {name: 'reimburseTime', label: '日期',filter:"timestampToDate"},
            {name: '操作', label: '操作', type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.currencyReimburses.listUrl, UrlConfigService.urlConfig.currencyReimburses.saveUrl, $resource, $q, $http, _schema);
        this._formUrl = UrlConfigService.urlConfig.currencyReimburses.formUrl;
        this._getDelete = UrlConfigService.urlConfig.currencyReimburses.deleteUrl;
        this._schema = _schema;

        this.getSeatSum = function (hallModelList) {
            var seatSum = 0;
            for (var hallModel in hallModelList) {
                seatSum += parseFloat(hallModelList[hallModel].remiburseMoney);
            }
            return seatSum;
        };

        //删除
        this.getDelete = function(id){
            return $resource(this._getDelete,{id:id},{
                'update': {method: 'DELETE'}
            }).update();
        };

        this.getForm = function (id) {
            return $resource(this._formUrl,{id:id}).get();
        };
    }

    CurrencyReimbursementService.prototype = Object.create(BaseListService.prototype);
    CurrencyReimbursementService.$inject = ['$resource', '$q', '$http', 'UrlConfigService','FileStorageService'];

    angular.module('MetronicApp').service('CurrencyReimbursementService', CurrencyReimbursementService);
})(angular);

(function (angular) {
    function cinemaSignUpAuditBatchDeleteService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'department', label: '部门', sortable: false},
            {name: 'name', label: '姓名', sortable: false},
            {name: 'date', label: '日期',filter:"timestampToDate"},
            {name: '操作', label: '操作', type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.dataDictionary.url, $resource, $q, $http, _schema);
        this._schema = _schema;



    }

    cinemaSignUpAuditBatchDeleteService.prototype = Object.create(BaseListService.prototype);
    cinemaSignUpAuditBatchDeleteService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];

    angular.module('MetronicApp').service('cinemaSignUpAuditBatchDeleteService', cinemaSignUpAuditBatchDeleteService);
})(angular);