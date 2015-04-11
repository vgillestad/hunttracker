angular.module("HTControllers")

    .controller("MapCtrl", ["$scope", "$modal", "$timeout", "UserSource", "MarkerSource", "IconSource", "Helpers", function ($scope, $modal, $timeout, UserSource, MarkerSource, IconSource, Helpers) {
        $scope.actions = [{ name: "-Event-" }, { id: "#shot", name: "Shot animal" }, { id: "#observed", name: "Observation" }];
        $scope.animals = [{ name: "-Animal-" }, { id: "#deer", name: "Deer" }, { id: "#pig", name: "Pig" }];
        $scope.tracking = true;
        $scope.markers = [];
        $scope.icons = IconSource.getAll();

        UserSource.current(function (user) {
            $scope.user = user;
            MarkerSource.getByUserId({ userId: $scope.user.id }, function (markers) {
                $scope.markers = MarkerSource.filterAndMap(markers);
            });
        });


        var cleanMarkers = function () {
            if ($scope.marker && !$scope.marker.id) {
                $scope.markers = $scope.markers.filter(function (m) {
                    return m.id;
                });
            }
        }

        var togglePopover = function (show) {
            $scope.showPopIt = show ? Math.random() : null;
        }

        $scope.addMarker = function (coordinates) {
            cleanMarkers();
            $scope.marker = {
                coordinates: coordinates,
                icon: "default",
                iconSrc: $scope.icons["default"],
                dateTime: new Date()
            };
            $scope.markers.push($scope.marker);
            togglePopover(true);

            //$timeout(function () {
            //    var modal = $modal.open({
            //        templateUrl: "widget.modal.html",
            //        controller: "MapModalCtrl",
            //        size: "sm",
            //        resolve: {
            //            marker: function () {
            //                return $scope.marker;
            //            },
            //            icons: function () {
            //                return $scope.icons;
            //            }
            //        }
            //    });

            //    modal.result.then(function (marker) {
            //        $scope.marker = marker;
            //        $scope.addMarkerSubmit();
            //    }, function () {
            //        cleanMarkers();
            //    });

            //}, 100);
        };

        $scope.addMarkerSubmit = function () {
            if ($scope.marker.id) {
                MarkerSource.update($scope.marker);
            } else {
                $scope.marker.id = $scope.marker.id || Math.uuid();
                $scope.marker.userId = $scope.user.id;
                MarkerSource.add($scope.marker);
            }

            togglePopover(false);
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

        $scope.setIcon = function (icon) {
            $scope.marker.icon = icon;
            $scope.marker.iconSrc = $scope.icons[icon];
        }

        $scope.closeMarker = function () {
            cleanMarkers();
            togglePopover(false);
        };

        $scope.showMarkerDetails = function (marker) {
            cleanMarkers();
            $scope.marker = marker;
            togglePopover(true);
        }

        $scope.positionChanged = function (coordinates) {
            console.log("Position changed");
            $scope.markers.push({
                id: "you",
                coordinates: coordinates,
                popover: "This is you",
                iconSrc: $scope.icons["person"]
            });
        }
    }])

    .controller("MapModalCtrl", ["$scope", "$modalInstance", "marker", "icons", function ($scope, $modalInstance, marker, icons) {
        $scope.marker = marker;
        $scope.icons = icons;

        $scope.setIcon = function (icon) {
            $scope.marker.icon = icon;
            $scope.marker.iconSrc = $scope.icons[icon];
        }

        $scope.add = function () {
            $modalInstance.close($scope.marker);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);