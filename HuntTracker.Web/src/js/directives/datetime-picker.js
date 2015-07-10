angular.module("HTDirectives")

    .directive("datetimePicker", ["$compile", "$window", function ($compile, $window) {
        return {
            restrict: 'E',
            template:
                '<div class="form-group">' +
                    '<div class="input-group" style="max-width:170px;float:left;padding-right:5px">' +
                        '<input type="date" class="form-control" style="-webkit-appearance: none;" />' +
                        '<span class="input-group-addon">' +
                            '<i class="icon-calendar"></i>' +
                        '</span>' +
                    '</div>' +

                    '<div class="input-group">' +
                        '<input type="time" class="form-control" style="-webkit-appearance: none;" />' +
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
                var icons = {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "icon-arrow-up",
                    down: "icon-arrow-down",
                    previous: 'icon-arrow-left',
                    next: 'icon-arrow-right',
                    today: 'icon-shrink',
                    clear: 'icon-bin',
                };

                var $date = element.find('input[type="date"]');
                var $time = element.find('input[type="time"]');

                var updateModel = function () {
                    var date = $date.data("DateTimePicker").date();
                    var time = $time.data("DateTimePicker").date();
                    var update = new Date();
                    update.setDate(date.date());
                    update.setMonth(date.month());
                    update.setFullYear(date.year());
                    update.setHours(time.hour());
                    update.setMinutes(time.minutes());

                    scope.model = update.toISOString();
                    scope.$apply();
                };

                var updateModel2 = function () {
                    var update = moment($date.val());
                    var time = $time.val();
                    update.hour(time.substr(0,2));
                    update.minutes(time.substr(3,4));

                    scope.model = update.toISOString();
                    scope.$apply();
                };

                var useDateInput = Modernizr.inputtypes.date && $window.isMobileOrTablet();
                var useTimeInput = Modernizr.inputtypes.time && $window.isMobileOrTablet();

                if (useDateInput) {
                    $date.val(moment(scope.model).format('YYYY-MM-DD'));
                    $date.on("change", function (e) {
                        updateModel2();
                    });
                }
                else {
                    $date.attr('type', 'text');
                    $date.datetimepicker({
                        defaultDate: scope.model,
                        format: 'L',
                        icons: icons,
                    });
                    $date.siblings().first().on('click', function () {
                        $date.data("DateTimePicker").toggle();
                    });
                    $date.on("dp.change", function (e) {
                        updateModel();
                    });
                }

                if (useTimeInput) {
                    $time.val(moment(scope.model).format('HH:mm'));
                    $time.on("change", function () {
                        updateModel2();
                    });
                }
                else {
                    $time.attr('type', 'text');
                    $time.datetimepicker({
                        defaultDate: scope.model,
                        format: 'LT',
                        icons: icons,
                    });
                    $time.siblings().last().on('click', function () {
                        $time.data("DateTimePicker").toggle();
                    });
                    $time.on("dp.change", function (e) {
                        updateModel();
                    });
                }
            }
        };
    }]);