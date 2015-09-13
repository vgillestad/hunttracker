/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("HelpModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {
        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);