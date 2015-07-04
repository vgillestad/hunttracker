angular.module("HTDirectives")

    .directive("datetimePicker", ["$compile", "$window", function ($compile, $window) {
        return {
            restrict: 'E',
            template:
                '<div class="form-group">' +
                    '<div class="input-group" style="max-width:170px;float:left;padding-right:5px">' +
                        '<input type="date" class="form-control" />' +
                        '<span class="input-group-addon">' +
                            '<i class="icon-calendar"></i>' +
                        '</span>' +
                    '</div>' +

                    '<div class="input-group">' +
                        '<input type="time" class="form-control" />' +
                        '<span class="input-group-addon">' +
                            '<i class="icon-clock"></i>' +
                        '</span>' +
                    '</div>' +
                '</div>',
            replace: true,
            scope: {
                model: "=model"
            },
            link: function (scope, element, attrs) {
                var $date = element.find('input[type="date"]');
                var $time = element.find('input[type="time"]');

                if (!Modernizr.inputtypes.date || !$window.isMobileOrTablet()) {
                    $date.attr('type', 'text');
                    $date.datetimepicker({
                        format: 'L',
                    });
                    $date.siblings().first().on('click', function () {
                        $date.data("DateTimePicker").toggle();
                    });
                }

                if (!Modernizr.inputtypes.time || !$window.isMobileOrTablet()) {
                    $time.attr('type', 'text');
                    $time.datetimepicker({
                        format: 'LT'
                    });
                    $time.siblings().last().on('click', function () {
                        $time.data("DateTimePicker").toggle();
                    });
                }

                $date.val(moment(scope.model).format('L'));
                $time.val(moment(scope.model).format('LT'));
            }
        };
    }]);