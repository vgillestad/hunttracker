/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("MapCtrl", ["$scope", "$modal", "$timeout", "UserSource", "AuthSource", "MarkerSource", "IconSource", "FilterSource", "Helpers", function ($scope, $modal, $timeout, UserSource, AuthSource, MarkerSource, IconSource, FilterSource, Helpers) {
        $scope.tracking = false;
        $scope.markers = [];
        $scope.you = null;
        $scope.icons = IconSource.getAll();
        $scope.youIcon = "default";
        $scope.settings = {
            layer: 'norgeskart',
            filter: 'all',
        }

        UserSource.current(function (user) {
            $scope.user = user;
            MarkerSource.getByUserId({ userId: $scope.user.id }, function (markers) {
                $scope.markers = Helpers.mapIcons(markers, $scope.icons);
                if($scope.markers.length < 1) {
                    $scope.showHelp();
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

        $scope.setTracking = function () {
            $scope.tracking = !$scope.tracking;
            if (!$scope.tracking) {
                $scope.you.hidden = true;
            }
        }

        var modalIsOpen = false;
        var showMarkerModal = function () {
            var originalMarker = angular.copy($scope.marker, {});
            if (!modalIsOpen) {
                modalIsOpen = true;
                var modal = $modal.open({
                    templateUrl: "marker.modal.html",
                    controller: "MapModalCtrl",
                    size: "sm",
                    resolve: {
                        marker: function () { return $scope.marker; },
                        icons: function () { return $scope.icons; },
                        youAreHere: function () { return $scope.you && !$scope.you.hidden && $scope.marker.coordinates[0] === $scope.you.coordinates[0] && $scope.marker.coordinates[1] === $scope.you.coordinates[1] }
                    }
                });
            }

            modal.result.then(function (result) {
                modalIsOpen = false;
                if (result.action === "delete") {
                    var markerId = $scope.marker.id;
                    $scope.saveing = true;
                    MarkerSource.remove({ markerId: markerId }, function () {
                        $scope.saveing = false;
                        $scope.markers = $scope.markers.filter(function (marker) {
                            return marker.id !== markerId;
                        })
                    });
                } else if (result.action === "submit") {
                    $scope.addMarkerSubmit();
                }
            }, function () {
                modalIsOpen = false;
                $scope.marker = angular.copy(originalMarker, $scope.marker);
                cleanMarkers();
            });
        }

        $scope.addMarker = function (coordinates) {
            $scope.marker = {
                coordinates: coordinates,
                icon: "default",
                iconSrc: $scope.icons["default"],
                dateTime: new Date()
            };
            $scope.markers.push($scope.marker);
            showMarkerModal();
        };

        $scope.addMarkerSubmit = function () {
            $scope.saveing = true;
            if ($scope.marker.id) {
                MarkerSource.update($scope.marker, function () { $scope.saveing = false; });
            } else {
                $scope.marker.id = $scope.marker.id || Math.uuid();
                $scope.marker.userId = $scope.user.id;
                MarkerSource.add($scope.marker, function () { $scope.saveing = false; });
            }
        };

        $scope.showMarkerDetails = function (marker) {
            $scope.marker = marker;
            if ($scope.marker.id === "you") {
                $scope.youAreHere = true;
                $scope.addMarker($scope.marker.coordinates);
            }
            else {
                $scope.youAreHere = false;
                showMarkerModal();
            }
        }

        $scope.positionChanged = function (coordinates) {
            if ($scope.you) {
                $scope.you.coordinates = coordinates;
                $scope.you.hidden = false;
            } else { 
                $scope.you = {
                    id: "you",
                    icon: "default",
                    coordinates: coordinates,
                    iconSrc: angular.copy($scope.icons["default"],{})
                };
                $scope.you.iconSrc.color = "rgb(51, 122, 183)";
                $scope.markers.push($scope.you);
            }
        }

        var filters = FilterSource.getAll();
        $scope.applyFilter = function (filter, options) {
            $scope.settings.filter = filter;
            $scope.markers = filters[filter]($scope.markers, options);
        }

        $scope.showHelp = function () {
            $modal.open({
                templateUrl: "help.modal.html",
                controller: "HelpModalCtrl",
                size: "sm"
            });
        }
        
        $scope.logout = function () {
            AuthSource.logout(function () {
                location.href = "/login.html";
            });
        }
    }]);