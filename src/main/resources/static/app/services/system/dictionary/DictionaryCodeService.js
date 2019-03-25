/**
 * Created by wangwj on 2016/6/8.
 */
(function (angular) {
    function DictionaryCodeService($resource, $q, $http, UrlConfigService) {
        var _schema = [
            {name: 'key', label: '代码值', sortable: true},
            {name: 'text', label: '代码名称', sortable: false},
            {name: 'parentId', label: '父代码', sortable: false, filter: "parentFilter"},
            {name: 'value', label: '关联信息', sortable: false},
            {name: 'editable', label: '可编辑', sortable: true, filter: "editableFilter"},
            {name: 'discarded', label: '状态', sortable: true, filter: "discardedFilter"},
            {label: '操作', sortable: false, width: 190, type: 'template', templateUrl: 'operation.html'}
        ];

        BaseListService.call(this, UrlConfigService.urlConfig.system.dictionary.code.listUrl, $resource, $q, $http, _schema);
        this._schema = _schema;
        this._sort = 'discarded';
        this._url = UrlConfigService.urlConfig.system.dictionary.code.url;
        this._listUrl = UrlConfigService.urlConfig.system.dictionary.code.listUrl;
        this._discardUrl = UrlConfigService.urlConfig.system.dictionary.code.discardUrl;
        this._moveUpUrl = UrlConfigService.urlConfig.system.dictionary.code.moveup;
        this._moveDownUrl = UrlConfigService.urlConfig.system.dictionary.code.movedown;
        this._parentCodes = [];

        this.getParentCodes = function () {
            return this._parentCodes;
        };

        this.setParentCodes = function (parentCodes) {
            this._parentCodes = parentCodes;
        };
        this.list = function (categoryId) {
            var service = this;
            var resource = $resource(this._listUrl, {categoryId: categoryId});
            var queryMap = {page: this._storedPage, size: this._pageable.size};
            if (this._s_search) {
                for (var k in this._s_search) {
                    if (this._s_search.hasOwnProperty(k))
                        queryMap['s_' + k] = this._s_search[k];
                }
            }
            queryMap.sort = service.getSortAndOrder();
            return resource.get(queryMap);
        };

        this.get = function (id) {
            var resource = $resource(this._url, {id: id});
            return resource.get();
        };

        //新建或更新
        this.save = function (model) {
            if (undefined !== model.id) {
                return $resource(this._url, null, {
                    'update': {method: 'PUT'}
                }).update({id: model.id}, model);
            } else {
                return this.$resource(this._url).save(model);
            }

        };

        this.discard = function (id) {
            var resource = $resource(this._discardUrl, {id: id}, {discard: {method: 'PUT'}});
            return resource.discard();
        };

        this.moveUp = function (id) {
            var resource = $resource(this._moveUpUrl, {id: id, offset: 1}, {moveUp: {method: 'PUT'}});
            return resource.moveUp();
        };

        this.moveDown = function (id) {
            var resource = $resource(this._moveDownUrl, {id: id, offset: 1}, {moveDown: {method: 'PUT'}});
            return resource.moveDown();
        };

        this.getCodeByCategoryId = function (categoryId) {
            var resource = $resource(this._listUrl, {categoryId: categoryId});
            return resource.get();
        };
    }

    DictionaryCodeService.prototype = Object.create(BaseListService.prototype);
    DictionaryCodeService.$inject = ['$resource', '$q', '$http', 'UrlConfigService'];
    angular.module('MetronicApp').service('DictionaryCodeService', DictionaryCodeService);
})(angular);
