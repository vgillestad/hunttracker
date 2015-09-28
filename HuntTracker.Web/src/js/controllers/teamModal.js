/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("TeamModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {
        $scope.newTeam = {};
        
        
        $scope.createTeam = function () {
            
        }
        
        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);