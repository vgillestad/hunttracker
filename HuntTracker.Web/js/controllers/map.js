angular.module("HTControllers")

    .controller("MapCtrl", function ($scope, MarkerSource) {
        var userId = "e9c177ee-9c36-43b4-9813-1b2adc710732";
        $scope.actions = [{ id: "#shot", name: "Shot animal" }, { id: "#observed", name: "Observation" }];
        $scope.animals = [{ id: "#deer", name: "Deer" }, { id: "#pig", name: "Pig" }];
        $scope.tracking = true;
        $scope.markers = [];

        MarkerSource.getByUserId({ userId: userId }, function (markers) {
            markers.forEach(function (marker) {
                $scope.markers.push(marker);
            });
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
            $scope.marker.id = $scope.marker.id || Math.uuid();
            $scope.marker.userId = userId;
            MarkerSource.add($scope.marker, function () {
                console.log("added");
            });
            $scope.showPopIt = false;
        };

        $scope.addTag = function () {
            $scope.marker.description = $scope.marker.description || "";

            $scope.actions.forEach(function (action) {
                $scope.marker.description = $scope.marker.description.replace(action.id, "");
            });

            $scope.animals.forEach(function (animal) {
                $scope.marker.description = $scope.marker.description.replace(animal.id, "");
            });

            if ($scope.marker.action) {
                $scope.marker.description += " " + $scope.marker.action;
            }
            if ($scope.marker.animal) {
                $scope.marker.description += " " + $scope.marker.animal;
            }

            $scope.marker.description = $scope.marker.description.trim();
        };

        $scope.closeMarker = function () {
            cleanMarkers();
            $scope.showPopIt = false;
        };

        $scope.showMarkerDetails = function (marker) {
            cleanMarkers();
            $scope.marker = marker;
            $scope.showPopIt = true;
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