/* global Modernizr, moment */
angular.module("HTDirectives")

    .directive("markerIcon", ["$window", function ($window) {
        return {
            restrict: 'E',
            scope: {
                icon: "=icon",
            },
            link: function (scope, element, attrs) {
                var availableX = 37;
                var availableY = 49;
                var icon = scope.icon;
                if (scope.icon.type === 'image') {
                    var transformX = (availableX - (icon.size[0] * icon.scale)) / 2;
                    var transformY = (availableY - (icon.size[1] * icon.scale)) / 2;
                    var $div = $("<div></div>")
                        .css("height", icon.size[1] + 'px')
                        .css("width", icon.size[0] + 'px')
                        .css("background-repeat", "no-repeat")
                        .css("background-image", 'url(' + icon.src + ')')
                        .css("background-position", '-' + icon.offset[0] + 'px -' + icon.offset[1] + 'px')
                        .css("transform-origin", transformX + 'px ' + transformY + 'px')
                        .css("transform", 'scale(' + icon.scale + ')');
                    element.append($div);
                }
                if (scope.icon.type === 'font') {
                    var $i = $("<i></i>")
                        .css("font-size", "25px")
                        .addClass(icon.class);
                    element.append($i);
                }
            }
        };
    }]);