MetronicApp.service('UrlAnalysisService', ['$window', function ($window) {
    var search = $window.location.search;

    var searchObj = {};

    if (search.indexOf('?') != -1) {
        var arr = search.substr(1).split("&");
        for (var key in arr) {
            var tmparr = arr[key].split('=');
            if (tmparr[0] != '' && tmparr[0] != undefined) {
                searchObj[tmparr[0]] = tmparr[1];
            }
        }
    }

    return {search: searchObj};
}]);