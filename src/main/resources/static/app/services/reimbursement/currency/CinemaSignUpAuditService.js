(function (angular) {
    function cinemaSignUpAuditService($resource, $q, $http, UrlConfigService,FileStorageService) {
        var _schema = [
            {name: '', label: '序号', type: "seq"},
            {name: 'department', label: '部门', sortable: false},
            {name: 'name', label: '姓名', sortable: false},
            {name: 'date', label: '日期',filter:"timestampToDate"},
            {name: '操作', label: '操作', type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.currencyReimburses.listUrl, UrlConfigService.urlConfig.currencyReimburses.saveUrl, $resource, $q, $http, _schema);
        this._schema = _schema;

        this.getSeatSum = function (hallModelList) {
            var seatSum = 0;
            for (var hallModel in hallModelList) {
                seatSum += parseFloat(hallModelList[hallModel].remiburseMoney);
            }
            return seatSum;
        };
        //
        // //导出
        // this._exportUrl = UrlConfigService.urlConfig.CinemaSignUpAudit.exportUrl;
        // this.saveDocument = function(model){
        //     return $resource(this._saveUrl).save(model);
        // };
        // this.getRegions = function () {
        //     var resource = $resource(this._getRegionsUrl);
        //     return resource.get();
        // };
    }

    cinemaSignUpAuditService.prototype = Object.create(BaseListService.prototype);
    cinemaSignUpAuditService.$inject = ['$resource', '$q', '$http', 'UrlConfigService','FileStorageService'];

    angular.module('MetronicApp').service('cinemaSignUpAuditService', cinemaSignUpAuditService);
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