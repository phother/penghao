/**
 * Created by wangwj on 2016/6/7.
 */
(function (angular) {
    function DictionaryCategoryService($resource, UrlConfigService) {
        this._schema = [
            {name: 'key', label: '代码类型', sortable: true},
            {name: 'description', label: '描述', sortable: false},
            {name: 'discarded', label: '状态', sortable: true, filter: "discardedFilter"},
            {label: '操作', sortable: false, width: 180, type: 'template', templateUrl: 'operation.html'}
        ];

        this._searchListUrl = UrlConfigService.urlConfig.system.dictionary.category.searchListUrl;
        this._url = UrlConfigService.urlConfig.system.dictionary.category.url;
        this._discardUrl = UrlConfigService.urlConfig.system.dictionary.category.discardUrl;

        BaseListService.call(this, this._searchListUrl, this._url, $resource, this._schema);

        this.discard = function (id) {
            var resource = $resource(this._discardUrl, {id: id}, {discard: {method: 'PUT'}});
            return resource.discard();
        };
    }

    DictionaryCategoryService.prototype = new BaseListService().prototype;
    DictionaryCategoryService.$inject = ['$resource', 'UrlConfigService'];
    angular.module('MetronicApp').service('DictionaryCategoryService', DictionaryCategoryService);
})(angular);
