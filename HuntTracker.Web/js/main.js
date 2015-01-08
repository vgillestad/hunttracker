angular.module("hunters", ['gettext', 'openlayers-directive'])

    .controller("HuntersCtrl", function ($scope) {
        $scope.name = "Vegard";
        $scope.names = ["Kjell", "Geir", "Petter"];
    })

    .controller("MapCtrl", function ($scope) {
        $scope.name = "Map";
    });