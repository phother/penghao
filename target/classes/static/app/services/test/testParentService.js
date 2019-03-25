angular.module("MetronicApp").service("testParentService", ["$resource", function ($resource) {
    this._url = "";
    this.$resource = $resource;

    this._storedPage = 0;
    this._s_search = {};
    this._sort = '';
    this._order = '';
    this._schema = [];

    this._pageable = {
        "totalElements": 0,
        "numberOfElements": 0,
        "totalPages": 0,
        "first": true,
        "last": true,
        "size": 10,
        "number": 0,
        "fromNumber": 0,
        "toNumber": 0
    };

    //查询Schema定义
    this.getSchema = function () {
        return this._schema;
    };

    this.getStoredPage = function () {
        return this._storedPage;
    };

    this.setStoredPage = function (page) {
        this._storedPage = page;
    };

    this.putSearchParams = function (params) {
        for (var k in params) {
            if (params.hasOwnProperty(k))
                this._s_search[k] = params[k];
        }
    };

    this.clearSearchParams = function () {
        this._s_search = {}
    };

    this.getSort = function () {
        return this._sort;
    };

    this.setSort = function (sort) {
        this._sort = sort;
    };

    this.getSize = function () {
        return this._pageable.size;
    };

    this.setSize = function (size) {
        this._pageable.size = size;
    };

    this.getOrder = function () {
        return this._order;
    };

    this.setOrder = function (order) {
        this._order = order;
    };

    this.getPageable = function () {
        return this._pageable;
    };

    this.getSortAndOrder = function () {
        if (this._sort && this._order) {
            return this._sort + "," + this._order;
        } else {
            return "";
        }
    };

    this.get = function (url, id) {
        return this.$resource(url).get({id: id});
    };

    this.list = function (searchListUrl) {
        var service = this;
        var resource = this.$resource(searchListUrl, {}, {"searchList": {"method": "POST"}});
        var queryMap = {page: this.getStoredPage(), size: this._pageable.size};
        if (this._s_search) {
            for (var k in this._s_search) {
                if (this._s_search.hasOwnProperty(k) && !!this._s_search[k])
                    queryMap['s_' + k] = this._s_search[k];
            }
        }
        queryMap.sort = service.getSortAndOrder();
        return resource.searchList(queryMap);
    };

    this.delete = function (url ,id) {
        var deleteUrl = url + "/" + id;
        var resource = this.$resource(deleteUrl);
        return resource.delete();
    };

    //新建或更新
    this.save = function (url, model) {
        if (undefined !== model.id) {
            return this.$resource(url, {id: model.id}, {
                'update': {method: 'PUT'}
            }).update(model);
        } else {
            return this.$resource(url).save(model);
        }

    };
}]);