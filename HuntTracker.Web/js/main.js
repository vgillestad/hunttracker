angular.module("HuntTracker", ["gettext", "HuntersDirectives"])

    .controller("MenuCtrl", function ($scope) {
        $scope.name = "Vegard";
        $scope.names = ["Kjell", "Geir", "Petter"];
    })

    .controller("MapCtrl", function ($scope) {
        $scope.actions = [{ id: "#shot", name: "Shot animal" }, { id: "#observed", name: "Observation" }];
        $scope.animals = [{ id: "#deer", name: "Deer" }, { id: "#pig", name: "Pig" }];
        $scope.tracking = true;
        $scope.markers = [];
        $scope.markers.push({
            coordinates: [2629703.3656816175, 9797587.027268754]
        });

        $scope.addMarker = function (coordinates) {
            $scope.markers.push({
                coordinates: coordinates
            });
            $scope.showPopIt = true;
        };

        $scope.addMarkerConfirm = function () {
            $scope.showPopIt = false;
            console.log("addMarkerConfirm");
        };

        $scope.closeMarker = function () {
            $scope.showPopIt = false;
            console.log("closeMarkerConfirm");
        };

        $scope.showMarkerDetails = function (marker) {
            $scope.showPopIt = true;
            console.log("showMarkerDetails");
        }

        $scope.positionChanged = function (coordinates) {
            console.log("Position changed");
            $scope.markers.push({
                coordinates: coordinates,
                popover: "This is you"
            });
        }
    });