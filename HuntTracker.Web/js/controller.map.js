angular.module("HTControllers")

    .controller("MapCtrl", function ($scope) {
        $scope.actions = [{ id: "#shot", name: "Shot animal" }, { id: "#observed", name: "Observation" }];
        $scope.animals = [{ id: "#deer", name: "Deer" }, { id: "#pig", name: "Pig" }];
        $scope.tracking = true;
        $scope.markers = [];

        $scope.markers.push({
            id: Math.uuid(),
            coordinates: [2629703.3656816175, 9797587.027268754]
        });

        var cleanMarkers = function () {
            if ($scope.marker && !$scope.marker.id) {
                $scope.markers = $scope.markers.filter(function (m) {
                    return m.id;
                });
            }
        }

        $scope.addMarker = function (coordinates) {
            cleanMarkers();
            $scope.marker = {
                coordinates: coordinates
            };
            $scope.markers.push($scope.marker);
            $scope.showPopIt = true;
        };

        $scope.addMarkerConfirm = function () {
            $scope.marker.id = Math.uuid();
            $scope.showPopIt = false;
            console.log("addMarkerConfirm");
        };

        $scope.closeMarker = function () {
            cleanMarkers();
            $scope.showPopIt = false;
            console.log("closeMarkerConfirm");
        };

        $scope.showMarkerDetails = function (marker) {
            cleanMarkers();
            $scope.marker = marker;
            $scope.showPopIt = true;
            console.log("showMarkerDetails");
        }

        $scope.positionChanged = function (coordinates) {
            console.log("Position changed");
            $scope.markers.push({
                id: "you",
                coordinates: coordinates,
                popover: "This is you"
            });
        }
    });