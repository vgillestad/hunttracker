/* global Modernizr, moment */
angular.module("HTDirectives")

    .directive("datetimePicker", ["$window", function ($window) {
        return {
            restrict: 'E',
            template:
            '<div class="form-group">' +
            '<div class="input-group" style="max-width:168px;float:left;padding-right:5px">' +
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
                model: "=model",
                dateOnly: "=?dateOnly"
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

                if (scope.dateOnly) {
                    element.find(".input-group").last().remove();
                }

                var $date = element.find('input[type="date"]');
                var $time = element.find('input[type="time"]');

                var updateModelFromPicker = function () {
                    var date = $date.data("DateTimePicker").date();

                    var update = new Date();
                    update.setDate(date.date());
                    update.setMonth(date.month());
                    update.setFullYear(date.year());
                    if (!scope.dateOnly) {
                        var time = $time.data("DateTimePicker").date();
                        update.setHours(time.hour());
                        update.setMinutes(time.minutes());
                    }
                    else {
                        update.setHours(0);
                        update.setMinutes(0);
                    }

                    scope.model = update.toISOString();
                    scope.$apply();
                };

                var updateModelFromNative = function () {
                    var update = moment($date.val());
                    if(!scope.dateOnly) {
                        var time = $time.val();
                        update.hour(time.substr(0, 2));
                        update.minutes(time.substr(3, 4));    
                    }
                    else {
                        update.hours(0);
                        update.minutes(0);
                    }

                    scope.model = update.toISOString();
                    scope.$apply();
                };

                var useNative = Modernizr.inputtypes.date && Modernizr.inputtypes.time && $window.isMobileOrTablet;

                if (useNative) {
                    //Date
                    $date.val(moment(scope.model).format('YYYY-MM-DD'));
                    $date.on("change", function (e) {
                        updateModelFromNative();
                    });
                    
                    //Time
                    if (!scope.dateOnly) {
                        $time.val(moment(scope.model).format('HH:mm'));
                        $time.on("change", function () {
                            updateModelFromNative();
                        });
                    }
                }
                else {
                    //Date 
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
                        updateModelFromPicker();
                    });
                    
                    //Time
                    if (!scope.dateOnly) {
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
                            updateModelFromPicker();
                        });
                    }
                }
            }
        };
    }]);