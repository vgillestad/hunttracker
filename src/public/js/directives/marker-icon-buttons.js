/* global Modernizr, moment */
angular.module("HTDirectives")

    .directive("markerIconButtons", ["$window", function ($window) {
        return {
            restrict: 'E',
            template:
                '<div></div>',
            replace: true,
            scope: {
                icons: "=icons",
                selectedIcon: "=selectedIcon",
                onIconSelected: "&onIconSelected"
            },
            link: function (scope, element, attrs) {
                var availableX = 37;
                var availableY = 49;
                var dismissEvent = false;
                var buttons = [];

                Object.keys(scope.icons).forEach(function (key) {
                    var icon = scope.icons[key];
                    var $button = $("<button class='btn btn-default animal-btn'></button>");
                    if (scope.selectedIcon === key) {
                        $button.addClass("btn-selected");
                    }
                    if (icon.type === 'image') {
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
                        $button.append($div);
                    }
                    if (icon.type === 'font') {
                        var $i = $("<i></i>")
                            .css("font-size", "25px")
                            .addClass(icon.class);
                        $button.append($i);
                    }
                    $button.on("click", function () {
                        scope.$apply(function () {
                            scope.onIconSelected({ icon: key });
                        })
                    });
                    buttons[key] = $button;
                    element.append($button);
                });

                scope.$watch("selectedIcon", function (selectedIcon) {
                    element.find(".btn").removeClass("btn-selected");
                    if (buttons[selectedIcon]) {
                        buttons[selectedIcon].addClass("btn-selected");
                    }
                });

                scope.$on('$destroy', function () {
                    Object.keys(buttons).forEach(function (key) {
                        buttons[key].off();
                    })
                    //Read more http://stackoverflow.com/questions/26983696/angularjs-does-destroy-remove-event-listeners
                });
            }
        };
    }]);