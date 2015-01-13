angular.module("HuntTracker", ["gettext", "HuntersDirectives"])

    .controller("MenuCtrl", function ($scope) {
        $scope.name = "Vegard";
        $scope.names = ["Kjell", "Geir", "Petter"];
    })

    .controller("MapCtrl", function ($scope) {
        $scope.tracking = true;
        $scope.markers = [];
        $scope.markers.push({
            coordinates: [2629703.3656816175, 9797587.027268754]
        });

        $scope.addMarker = function (eventPosition, coordinates) {
            $scope.markers.push({
                coordinates: coordinates
            });
        };

        $scope.showMarkerDetails = function (id) {
            console.log(id);
        }

        $scope.positionChanged = function (coordinates) {
            console.log("Position changed");
            $scope.markers.push({
                coordinates: coordinates
            });
        }
    });