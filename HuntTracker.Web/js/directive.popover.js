angular.module("HuntersDirectives")

    .directive("popItOver", function ($compile) {
        return {
            restrict: "E",
            transclude: true,
            scope: {
                show: "="
            },
            link: function (scope, element, attrs) {
                var $target = $(attrs.target);
                var popover = $target.popover({ 'html': true, content: "this is actual content" }).popover("show");
                var popoverContent = popover.data("bs.popover").$tip.find(".popover-content").first();
                popoverContent.html(element.children());
                element.remove();

                scope.$watch("show", function() {
                    if (scope.show) {
                        popover.popover("show");
                    } else {
                        popover.popover("hide");
                    }
                });
            }
        };
    });