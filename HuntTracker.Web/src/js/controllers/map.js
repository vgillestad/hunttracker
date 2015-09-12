/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("MapCtrl", ["$scope", "$modal", "$timeout", "UserSource", "AuthSource", "MarkerSource", "IconSource", "FilterSource", "Helpers", function ($scope, $modal, $timeout, UserSource, AuthSource, MarkerSource, IconSource, FilterSource, Helpers) {
        $scope.tracking = false;
        $scope.markers = [];
        $scope.you = null;
        $scope.icons = IconSource.getAll();
        $scope.layers = [{ id: "norgeskart", name: "Norwegian Map" }, { id: "satellite", name: "Satellite Imagery" }, { id: "osm", name: "Open Street Map" }];
        $scope.settings = {
            layer: $scope.layers[0].id,
            filter: 'all',
        }
        $scope.show = {
            location: true
        };

        $scope.logout = function () {
            AuthSource.logout(function () {
                location.href = "/login.html";
            });
        }

        UserSource.current(function (user) {
            $scope.user = user;
            MarkerSource.getByUserId({ userId: $scope.user.id }, function (markers) {
                $scope.markers = Helpers.mapIcons(markers, $scope.icons);
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
            if(!$scope.tracking) {
                $scope.you.hidden = true;
            }
        }

        var modalIsOpen = false;
        var showMarkerModal = function () {
            var originalMarker = angular.copy($scope.marker, {});
            if (!modalIsOpen) {
                modalIsOpen = true;
                var modal = $modal.open({
                    templateUrl: "widget.modal.html",
                    controller: "MapModalCtrl",
                    size: "sm",
                    resolve: {
                        marker: function () { return $scope.marker; },
                        icons: function () { return $scope.icons; },
                        youAreHere: function () { return $scope.you && !$scope.you.hidden && $scope.marker.coordinates[0] === $scope.you.coordinates[0] && $scope.marker.coordinates[1] === $scope.you.coordinates[1]}
                    }
                });
            }

            modal.result.then(function (result) {
                modalIsOpen = false;
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
                modalIsOpen = false;
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
            showMarkerModal();
        };

        $scope.addMarkerSubmit = function () {
            if ($scope.marker.id) {
                MarkerSource.update($scope.marker);
            } else {
                $scope.marker.id = $scope.marker.id || Math.uuid();
                $scope.marker.userId = $scope.user.id;
                MarkerSource.add($scope.marker);
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
                    icon: "pin",
                    coordinates: coordinates,
                    iconSrc: $scope.icons["pin"]
                };
                $scope.you.iconSrc.color = "green";
                $scope.markers.push($scope.you);
            }
            
            console.log("position changed");
        }
       
        var filters = FilterSource.getAll(); 
        $scope.applyFilter = function (filter, options) {
            $scope.settings.filter = filter;
            $scope.markers = filters[filter]($scope.markers, options);
        }

        $scope.setLayer = function () {
            console.log("set layer called");
        }
    }]);