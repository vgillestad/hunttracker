angular.module("HuntersDirectives")

    .directive("popItOver", function ($compile) {
        return {
            restrict: "E",
            transclude: true,
            scope: {
                show: "="
            },
            compile: function (element, attrs, transcludeFn) {
                return function postLink(scope, element, attrs, controller) {
                    var $target = $(attrs.target);
                    var popover = $target.popover({
                        html: true,
                        content: transcludeFn(scope.$parent)
                    });

                    scope.$watch("show", function () {
                        if (scope.show) {
                            popover.popover("show");
                        } else {
                            popover.popover("hide");
                        }
                    });
                };
            }
        };
    });