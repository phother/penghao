/**
 * 共通过滤器
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp").filter("timestampToDate", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("date");
        return filter(value, "yyyy-MM-dd");
    }
}]).filter("timestampToTime", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("date");
        return filter(value, "yyyy-MM-dd HH:mm:ss");
    }
}]).filter("timestampToMinutes", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("date");
        return filter(value, "yyyy-MM-dd HH:mm");
    }
}]).filter("numberToRMB", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("currency");
        return filter(value, "￥");
    }
}]).filter("number2Decimal", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("number");
        return filter(value, "2");
    }
}]).filter("number4Decimal", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("number");
        return filter(value, "4");
    }
}]).filter("number4Decimal", ["$filter", function ($filter) {
    return function (value) {
        var filter = $filter("number");
        return filter(value, "4");
    }
}]).filter("percentFormat", function () {
    return function (value) {
        if (angular.isNumber(value))
            value = value + "%";
        return value;
    }
}).filter("numberToYuan", function () {
    return function (value) {
        var filter = $filter("number");
        return filter(value, "2") + "元";
    }
});