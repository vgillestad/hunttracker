angular.module("HTControllers")

    .controller("MapCtrl", ["$scope", "$modal", "$timeout", "UserSource", "MarkerSource", "IconSource", "Helpers", function ($scope, $modal, $timeout, UserSource, MarkerSource, IconSource, Helpers) {
        $scope.tracking = true;
        $scope.markers = [];
        $scope.you = null;
        $scope.icons = IconSource.getAll();

        UserSource.current(function (user) {
            $scope.user = user;
            MarkerSource.getByUserId({ userId: $scope.user.id }, function (markers) {
                $scope.markers = MarkerSource.filterAndMap(markers);
                if ($scope.you) {
                    $scope.markers.push($scope.you);
                }
            });
        });


        var cleanMarkers = function () {
            if ($scope.marker && !$scope.marker.id) {
                $scope.markers = $scope.markers.filter(function (m) {
                    return m.id;
                });
            }
        }


        var showMarkerModal = function () {
            var originalMarker = angular.copy($scope.marker, {});
            var modal = $modal.open({
                templateUrl: "widget.modal.html",
                controller: "MapModalCtrl",
                size: "sm",
                resolve: {
                    marker: function () { return $scope.marker; },
                    icons: function () { return $scope.icons; }
                }
            });

            modal.result.then(function (result) {
                if (result.action === "delete") {
                    var markerId = $scope.marker.id;
                    MarkerSource.remove({ markerId: markerId }, function () {
                        $scope.markers = $scope.markers.filter(function (marker) {
                            return marker.id !== markerId;
                        })
                    });
                } else if (result.action === "submit") {
                    $scope.addMarkerSubmit();
                }
            }, function () {
                $scope.marker = angular.copy(originalMarker, $scope.marker);
                cleanMarkers();
            });
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
            $timeout(showMarkerModal, 100);
        };

        $scope.addMarkerSubmit = function () {
            if ($scope.marker.id === "you") {
                $scope.marker = angular.extend({}, $scope.marker);
                $scope.marker.id = undefined;
            }
            if ($scope.marker.id) {
                MarkerSource.update($scope.marker);
            } else {
                $scope.marker.id = $scope.marker.id || Math.uuid();
                $scope.marker.userId = $scope.user.id;
                MarkerSource.add($scope.marker);
            }
        };

        $scope.showMarkerDetails = function (marker) {
            cleanMarkers();
            $scope.marker = marker;
            showMarkerModal();
        }

        $scope.positionChanged = function (coordinates) {
            if ($scope.you) {
                $scope.you.coordinates = coordinates;
            } else {
                $scope.you = {
                    id: "you",
                    coordinates: coordinates,
                    iconSrc: $scope.icons["person"]
                };
                $scope.markers.push($scope.you);
            }
        }
    }])

    .controller("MapModalCtrl", ["$scope", "$modalInstance", "marker", "icons", function ($scope, $modalInstance, marker, icons) {
        $scope.marker = marker;
        $scope.icons = icons;

        var editMarker = $scope.marker.id && $scope.marker.id !== "you";
        $scope.submitText = editMarker ? "Save" : "Add";
        $scope.showDelBtn = editMarker;

        $scope.setIcon = function (icon) {
            $scope.marker.icon = icon;
            $scope.marker.iconSrc = $scope.icons[icon];
        }

        $scope.submit = function () {
            $modalInstance.close({ action: "submit" });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };

        $scope.delete = function () {
            $scope.showDelBtn = false;
            $scope.showDelConfirmBtn = true;
        }

        $scope.deleteConfirm = function () {
            $modalInstance.close({ action: "delete" });
        }
    }]);