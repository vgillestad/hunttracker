angular.module("HTControllers")

    .controller("MenuCtrl", function ($scope) {
        $scope.name = "Vegard";
        $scope.names = ["Kjell", "Geir", "Petter"];
    })