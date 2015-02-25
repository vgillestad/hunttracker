angular.module("HTControllers")

    .controller("MenuCtrl", function ($scope, AuthSource) {

        $scope.logout = function () {
            AuthSource.logout(function () {
                location.href = "/login.html";
            });
        }
    })