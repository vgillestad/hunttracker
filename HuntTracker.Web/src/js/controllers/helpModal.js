/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("HelpModalCtrl", ["$scope", "$uibModalInstance", function ($scope, $modalInstance) {
        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);