/* global angular */
angular.module("HTControllers")

    .controller("MenuCtrl", ["$scope", "AuthSource", function ($scope, AuthSource) {

        $scope.logout = function () {
            AuthSource.logout(function () {
                location.href = "/login.html";
            });
        }
    }])