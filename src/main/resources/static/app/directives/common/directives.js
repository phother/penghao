/***
 GLobal Directives
 ***/

// Route State Load Spinner(used on page or content load)
angular.module("MetronicApp").directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        //App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                $rootScope.$on('dataRequestStart', function () {
                    element.removeClass('hide'); // show spinner bar
                    $('body').css("overflow", "hidden");
                    $("#cover").show();
                });
                $rootScope.$on('dataRequestEnd', function () {
                    element.addClass('hide'); // show spinner bar
                    $('body').css("overflow", "auto");
                    $("#cover").hide();
                });
            }
        };
    }
])

// Handle global LINK click
angular.module("MetronicApp").directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
angular.module("MetronicApp").directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});

angular.module("MetronicApp").directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});
angular.module("MetronicApp").directive('enterSearch', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.bind('keypress', function (event) {
                if (event.keyCode == "13") {
                    scope[attr.enterSearch]();
                }
            });
        }
    };
});
angular.module("MetronicApp").directive('changeSearch', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.bind('change', function () {
                scope[attr.changeSearch]();
            });
        }
    };
});
angular.module("MetronicApp").directive('repeatFinish', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.attr('id', attr.backId);
            if (scope.$last == true) {
                scope.$eval(scope.repeatFinish);
            }
        }
    }
});