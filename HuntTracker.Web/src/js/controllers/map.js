/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("MapCtrl", ["$scope", "$uibModal", "$timeout", "UserSource", "AuthSource", "MarkerSource", "IconSource", "FilterSource", "TeamSource", "Helpers", function ($scope, $modal, $timeout, UserSource, AuthSource, MarkerSource, IconSource, FilterSource, TeamSource, Helpers) {
        $scope.loading = true;
        $scope.tracking = false;
        $scope.markers = [];
        $scope.you = null;
        $scope.layers = { "norgeskart": "Norgeskart", "satellite": "Satellite Imagery" };
        $scope.icons = IconSource.getAll();
        $scope.standardFilters = FilterSource.getAll();
        $scope.youIcon = "default";

        var getTeamAndMarkers = function () {
            var currentMarkerCount = $scope.markers ? $scope.markers.length : null;
            MarkerSource.getByUserId({ userId: $scope.user.id }, function (markers) {
                $scope.loading = false;
                markers = Helpers.mapIcons(markers, $scope.icons);
                markers = Helpers.applyFilter($scope.standardFilters[$scope.user.settings.filter] || $scope.user.filters[$scope.user.settings.filter], markers, $scope.user, $scope.icons);
                $scope.markers = markers;
                if ($scope.markers.length < 1) {
                    $scope.showHelpModal();
                }
                if ($scope.you) {
                    $scope.markers.push($scope.you);
                }
                if (currentMarkerCount && currentMarkerCount !== $scope.markers.length) {
                    $scope.fitMapToMarkersTrigger = Math.random();
                }
            });
            $scope.teams = TeamSource.getMyTeams({ activeOnly: true });
        }

        UserSource.me(function (user) {
            $scope.user = user;
            $scope.user.settings = $scope.user.settings || {
                filter: "all",
                layer: "norgeskart"
            }
            getTeamAndMarkers();
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
                $scope.trackingLoading = false;
            }
            else {
                $scope.trackingLoading = true;
            }
        }

        var modalIsOpen = false;
        var showMarkerModal = function () {
            var originalMarker = angular.copy($scope.marker, {});
            if (!modalIsOpen) {
                modalIsOpen = true;
                var modal = $modal.open({
                    templateUrl: "marker.mine.tpl.html",
                    controller: "MarkerMineModalCtrl",
                    size: "sm",
                    resolve: {
                        marker: function () { return $scope.marker; },
                        icons: function () { return $scope.icons; },
                        teams: function () { return $scope.teams; },
                        position: function () {
                            return {
                                youAreHere: $scope.you && !$scope.you.hidden && $scope.marker.coordinates[0] === $scope.you.coordinates[0] && $scope.marker.coordinates[1] === $scope.you.coordinates[1],
                                accuracy: $scope.you ? $scope.you.accuracy : ""
                            }
                        }
                    }
                });
            }

            modal.result.then(function (result) {
                modalIsOpen = false;
                if (result.action === "delete") {
                    var markerId = $scope.marker.id;
                    $scope.loading = true;
                    MarkerSource.remove({ markerId: markerId }, function () {
                        $scope.loading = false;
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

        var showMarkerOtherModal = function () {
            $modal.open({
                templateUrl: "marker.other.tpl.html",
                controller: "MarkerOtherModalCtrl",
                size: "sm",
                resolve: {
                    marker: function () { return $scope.marker; },
                    icons: function () { return $scope.icons; },
                    teams: function () { return $scope.teams; },
                }
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
            $scope.loading = true;
            if ($scope.marker.id) {
                MarkerSource.update($scope.marker, function () { $scope.loading = false; });
            } else {
                $scope.marker.id = $scope.marker.id || Math.uuid();
                $scope.marker.userId = $scope.user.id;
                MarkerSource.add($scope.marker, function () { $scope.loading = false; });
            }
        };

        $scope.showMarkerDetails = function (marker) {
            $scope.marker = marker;
            if ($scope.marker.id === "you") {
                $scope.addMarker($scope.marker.coordinates);
            }
            else if ($scope.marker.userId === $scope.user.id) {
                showMarkerModal();
            }
            else {
                showMarkerOtherModal();
            }
        }

        $scope.positionChanged = function (coordinates, accuracy) {
            $scope.trackingLoading = false;
            if ($scope.you) {
                $scope.you.coordinates = coordinates;
                $scope.you.hidden = false;
                $scope.you.accuracy = Math.round(accuracy);
            } else {
                $scope.you = {
                    id: "you",
                    coordinates: coordinates,
                    accuracy: Math.round(accuracy),
                    iconSrc: angular.copy($scope.icons["you"], {})
                };
                $scope.you.iconSrc.color = "rgb(51, 122, 183)";
                $scope.markers.push($scope.you);
            }
        }

        $scope.setLayer = function(layer) {
            $scope.user.settings.layer = layer;
            UserSource.updateMe($scope.user);
        }

        $scope.setFilter = function (filter, options) {
            $scope.user.settings.filter = filter;
            $scope.markers = Helpers.applyFilter($scope.standardFilters[filter] || $scope.user.filters[filter], $scope.markers, $scope.user, $scope.icons);
            $scope.fitMapToMarkersTrigger = Math.random();
            UserSource.updateMe($scope.user);
        }

        $scope.showHelpModal = function () {
            $modal.open({
                templateUrl: "help.tpl.html",
                controller: "HelpModalCtrl",
                size: "sm"
            });
        }

        $scope.showTeamModal = function () {
            var teamModal = $modal.open({
                templateUrl: "team.tpl.html",
                controller: "TeamModalCtrl",
                size: "md"
            });
            teamModal.result.then(function () { }, function () {
                $scope.loading = true;
                getTeamAndMarkers();
            });
        }

        $scope.showFilterModal = function (filterId) {
            $scope.user.filters = $scope.user.filters || {};
            var filter = filterId !== null ? $scope.user.filters[filterId] : null;
            var teamModal = $modal.open({
                templateUrl: "filter.tpl.html",
                controller: "FilterModalCtrl",
                size: "md",
                resolve: {
                    user: function () { return $scope.user; },
                    teams: function () { return $scope.teams; },
                    markers: function () { return $scope.markers; },
                    filter: function () { return filter; }
                }
            });
            teamModal.result.then(function (result) {
                if (!filterId) { //New filter
                    filterId = Math.uuid();
                }
                $scope.user.filters[filterId] = result.filter;
                $scope.setFilter(filterId);
            }, function () { });
        }

        $scope.logout = function () {
            AuthSource.logout(function () {
                location.href = "/login.html";
            });
        }
    }]);