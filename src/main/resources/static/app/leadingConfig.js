/**
 * Created by wangwj on 16-8-16.
 */
if (moment && moment.isMoment(moment())) {
    moment.locale("zh-cn");
}

angular.module("MetronicApp").config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        target: '/upload',
        testChunks: false,
        simultaneousUploads: 3,
        generateUniqueIdentifier: function () {
            return new UUID().createUUID();
        }
    }
}]);

//通知消息全局配置
angular.module("MetronicApp").config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        closeButton: true
    });
});

//日历全局配置控件
angular.module("MetronicApp").config(function (dateTimeConfig) {
    angular.extend(dateTimeConfig, {
        format: "YYYY-MM-DD",
        position: 'absolute'
    });
});

//修复日历控件 初始值为空，但显示不为空的问题
angular.module('MetronicApp').config(function ($provide) {
    $provide.decorator('mFormatFilter', function () {
        return function newFilter(m, format, tz) {
            if (!m) {
                return '';
            }
            if (!(moment.isMoment(m))) {
                m = moment(m);
            }
            return tz ? moment.tz(m, tz).format(format) : m.format(format);
        };
    });
});

//表格分页插件全局配置
angular.module("MetronicApp").constant('uibPaginationConfig', {
    itemsPerPage: 10,
    boundaryLinks: true,
    boundaryLinkNumbers: true,
    directionLinks: true,
    firstText: '<<',
    previousText: '<',
    nextText: '>',
    lastText: '>>',
    rotate: true,
    forceEllipses: false
});

angular.module("MetronicApp").factory('uibPaging', ['$parse', function ($parse) {
    return {
        create: function (ctrl, $scope, $attrs) {
            ctrl.setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
            ctrl.ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl
            ctrl._watchers = [];

            ctrl.init = function (ngModelCtrl, config) {
                ctrl.ngModelCtrl = ngModelCtrl;
                ctrl.config = config;

                ngModelCtrl.$render = function () {
                    ctrl.render();
                };

                if ($attrs.itemsPerPage) {
                    ctrl._watchers.push($scope.$parent.$watch($attrs.itemsPerPage, function (value) {
                        ctrl.itemsPerPage = parseInt(value, 10);
                        $scope.totalPages = ctrl.calculateTotalPages();
                        ctrl.updatePage();
                    }));
                } else {
                    ctrl.itemsPerPage = config.itemsPerPage;
                }

                $scope.$watch('totalItems', function (newTotal, oldTotal) {
                    if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
                        $scope.totalPages = ctrl.calculateTotalPages();
                        ctrl.updatePage();
                    }
                });
            };

            ctrl.calculateTotalPages = function () {
                var totalPages = ctrl.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / ctrl.itemsPerPage);
                return Math.max(totalPages || 0, 1);
            };

            ctrl.render = function () {
                $scope.page = parseInt(ctrl.ngModelCtrl.$viewValue, 10) || 0;
            };

            $scope.selectPage = function (page, evt) {
                if (evt) {
                    evt.preventDefault();
                }

                var clickAllowed = !$scope.ngDisabled || !evt;
                if (clickAllowed && $scope.page !== page && page >= 0 && page <= $scope.totalPages - 1) {
                    if (evt && evt.target) {
                        evt.target.blur();
                    }
                    ctrl.ngModelCtrl.$setViewValue(page);
                    ctrl.ngModelCtrl.$render();
                }
            };

            $scope.getText = function (key) {
                return $scope[key + 'Text'] || ctrl.config[key + 'Text'];
            };

            $scope.noPrevious = function () {
                return $scope.page === 0;
            };

            $scope.noNext = function () {
                return $scope.page === $scope.totalPages - 1;
            };

            ctrl.updatePage = function () {
                ctrl.setNumPages($scope.$parent, $scope.totalPages - 1); // Readonly variable

                if ($scope.page > $scope.totalPages - 1) {
                    $scope.selectPage($scope.totalPages - 1);
                } else {
                    ctrl.ngModelCtrl.$render();
                }
            };

            $scope.$on('$destroy', function () {
                while (ctrl._watchers.length) {
                    ctrl._watchers.shift()();
                }
            });
        }
    };
}]);

angular.module("MetronicApp").controller('UibPaginationController', ['$scope', '$attrs', '$parse', 'uibPaging', 'uibPaginationConfig', function ($scope, $attrs, $parse, uibPaging, uibPaginationConfig) {
    var ctrl = this;
    // Setup configuration parameters
    var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : uibPaginationConfig.maxSize,
        rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : uibPaginationConfig.rotate,
        forceEllipses = angular.isDefined($attrs.forceEllipses) ? $scope.$parent.$eval($attrs.forceEllipses) : uibPaginationConfig.forceEllipses,
        boundaryLinkNumbers = angular.isDefined($attrs.boundaryLinkNumbers) ? $scope.$parent.$eval($attrs.boundaryLinkNumbers) : uibPaginationConfig.boundaryLinkNumbers,
        pageLabel = angular.isDefined($attrs.pageLabel) ? function (idx) {
            return $scope.$parent.$eval($attrs.pageLabel, {$page: idx});
        } : angular.identity;
    $scope.boundaryLinks = angular.isDefined($attrs.boundaryLinks) ? $scope.$parent.$eval($attrs.boundaryLinks) : uibPaginationConfig.boundaryLinks;
    $scope.directionLinks = angular.isDefined($attrs.directionLinks) ? $scope.$parent.$eval($attrs.directionLinks) : uibPaginationConfig.directionLinks;

    uibPaging.create(this, $scope, $attrs);

    if ($attrs.maxSize) {
        ctrl._watchers.push($scope.$parent.$watch($parse($attrs.maxSize), function (value) {
            maxSize = parseInt(value, 10);
            ctrl.render();
        }));
    }

    // Create page object used in template
    function makePage(number, text, isActive) {
        return {
            number: number,
            text: text,
            active: isActive
        };
    }

    function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 0, endPage = totalPages - 1;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
            if (rotate) {
                // Current page is displayed in the middle of the visible ones
                startPage = Math.max(currentPage - Math.floor(maxSize / 2), 0);
                endPage = startPage + maxSize - 1;
                // Adjust if limit is exceeded
                if (endPage > totalPages - 1) {
                    endPage = totalPages - 1;
                    startPage = endPage - maxSize + 1;
                }
            } else {
                // Visible pages are paginated with maxSize
                startPage = (Math.ceil((currentPage + 1) / maxSize) - 1) * maxSize;

                // Adjust last page if limit is exceeded
                endPage = Math.min(startPage + maxSize - 1, totalPages - 1);
            }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
            var page = makePage(number, pageLabel(number + 1), number === currentPage);
            pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
            if (startPage > 0) {
                if (!boundaryLinkNumbers || startPage > 2) { //need ellipsis for all options unless range is too close to beginning
                    var previousPageSet = makePage(startPage - 1, '...', false);
                    pages.unshift(previousPageSet);
                }
                if (boundaryLinkNumbers) {
                    if (startPage === 2) { //need to replace ellipsis when the buttons would be sequential
                        var secondPageLink = makePage(1, '2', false);
                        pages.unshift(secondPageLink);
                    }
                    //add the first page
                    var firstPageLink = makePage(0, '1', false);
                    pages.unshift(firstPageLink);
                }
            }

            if (endPage < totalPages - 1) {
                if (!boundaryLinkNumbers || endPage < totalPages - 3) { //need ellipsis for all options unless range is too close to end
                    var nextPageSet = makePage(endPage + 1, '...', false);
                    pages.push(nextPageSet);
                }
                if (boundaryLinkNumbers) {
                    if (endPage === totalPages - 3) { //need to replace ellipsis when the buttons would be sequential
                        var secondToLastPageLink = makePage(totalPages - 2, totalPages - 1, false);
                        pages.push(secondToLastPageLink);
                    }
                    //add the last page
                    var lastPageLink = makePage(totalPages - 1, totalPages, false);
                    pages.push(lastPageLink);
                }
            }
        }
        return pages;
    }

    var originalRender = this.render;
    this.render = function () {
        originalRender();
        if ($scope.page >= 0 && $scope.page <= $scope.totalPages - 1) {
            $scope.pages = getPages($scope.page, $scope.totalPages);
        }
    };
}]);

angular.module("uib/template/pager/pager.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/pager/pager.html",
        "<ul class=\"pager\">\n" +
        "  <li ng-class=\"{disabled: noPrevious()||ngDisabled, previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
        "  <li ng-class=\"{disabled: noNext()||ngDisabled, next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
        "</ul>\n" +
        "");
}]);

angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/pagination/pagination.html",
        "<ul class=\"pagination\">\n" +
        "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(0, $event)\">{{::getText('first')}}</a></li>\n" +
        "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
        "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
        "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
        "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages - 1, $event)\">{{::getText('last')}}</a></li>\n" +
        "</ul>\n" +
        "");
}]);