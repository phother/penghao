/**
 * select2全局配置
 */
angular.module('MetronicApp').constant('select2Config', {
    language: "zh-CN",
    allowClear: true,
    multiple: false,
    theme: "bootstrap",
    width: "off"
});
/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module("MetronicApp").directive('select2', ['select2Config', '$timeout', function (select2Config, $timeout) {
    var options = {};
    if (select2Config) {
        //扩展拷贝
        angular.extend(options, select2Config);
    }
    return {
        require: 'ngModel',
        priority: 2,//优先级
        compile: function (tElm, tAttrs) {
            var watch,
                repeatOption,
                repeatAttr,
                isSelect = tElm.is('select'),
                repeatAttrArray = [],
                index = 0;
            if (!isSelect) {
                if (window.console && console.error) {
                    console.error("select2 component must be structures of <select>");
                }
                return;
            }
            // Enable watching of the options dataset if in use
            if (tElm.attr("ng-options")) {
                repeatAttr = tElm.attr("ng-options");
                repeatAttrArray = jQuery.trim(repeatAttr.split('|')[0]).split(' ');
                index = repeatAttrArray.indexOf("in");
                watch = repeatAttrArray[index + 1];
            } else {
                repeatOption = tElm.find('optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');
                if (repeatOption.length) {
                    repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
                    repeatAttrArray = jQuery.trim(repeatAttr.split('|')[0]).split(' ');
                    index = repeatAttrArray.indexOf("in");
                    watch = repeatAttrArray[index + 1];
                }
            }

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.select2));

                if (!opts.placeholder && !attrs.placeholder) {
                    opts.allowClear = false;
                }

                delete opts.multiple;
                delete opts.initSelection;

                if (controller) {
                    //Watch the model for programmatic changes
                    scope.$watch(tAttrs.ngModel, function (current, old) {
                        if (!current) {
                            return;
                        }
                        if (current === old) {
                            return;
                        }
                        controller.$render();
                    }, true);
                    controller.$render = function () {
                        $timeout(function () {
                            elm.find('[value^="?"]').remove();    // 清除错误的数据
                            elm.val(controller.$viewValue);
                            elm.trigger("change");
                        });
                    };

                    // Watch the options dataset for changes
                    if (watch) {
                        scope.$watch(watch, function (newVal, oldVal, scope) {
                            if (angular.equals(newVal, oldVal)) {
                                return;
                            }
                            // Delayed so that the options have time to be rendered
                            $timeout(function () {
                                elm.val(controller.$viewValue);
                                elm.trigger("change");
                                // Refresh angular to remove the superfluous option
                                controller.$render();
                                if (newVal && !oldVal && controller.$setPristine) {
                                    controller.$setPristine(true);
                                }
                            });
                        });
                    }

                    // Update valid and dirty statuses
                    controller.$parsers.push(function (value) {
                        var div = elm.prev();
                        div
                            .toggleClass('ng-invalid', !controller.$valid)
                            .toggleClass('ng-valid', controller.$valid)
                            .toggleClass('ng-invalid-required', !controller.$valid)
                            .toggleClass('ng-valid-required', controller.$valid)
                            .toggleClass('ng-dirty', controller.$dirty)
                            .toggleClass('ng-pristine', controller.$pristine);
                        return value;
                    });
                }

                elm.bind("$destroy", function () {
                    elm.data('select2').destroy();
                });

                attrs.$observe('disabled', function (value) {
                    elm.prop('disabled', !!value);
                });

                attrs.$observe('readonly', function (value) {
                    elm.prop('disabled', !!value);
                });

                if (attrs.ngMultiple) {
                    scope.$watch(attrs.ngMultiple, function (newVal) {
                        attrs.$set('multiple', !!newVal);
                        elm.select2(opts);
                    });
                }
                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                $timeout(function () {
                    elm.select2(opts);
                    // important!
                    controller.$render();
                });
            };
        }
    };
}]);