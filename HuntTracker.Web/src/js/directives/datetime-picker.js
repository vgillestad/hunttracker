angular.module("HTDirectives")

    .directive("datetimePicker", ["$compile", function ($compile) {
        return {
            require: '?ngModel',
            restrict: 'AE',
            link: function (scope, element, attrs, ngModelCtrl) {
                var dp = element.datetimepicker({
                    locale: "nb",
                    useCurrent: true
                });

                ngModelCtrl.$render = function () {
                    var date = ngModelCtrl.$viewValue;
                    var newDate = moment(date);
                    element.data("DateTimePicker").date(newDate);
                }

                element.on("dp.change", function (e) {
                    var date = element.data("DateTimePicker").date();
                    ngModelCtrl.$setViewValue(date);
                });
            }
        };
    }]);