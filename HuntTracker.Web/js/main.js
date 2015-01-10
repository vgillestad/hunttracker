angular.module("HuntTracker", ["gettext", "openlayers-directive"])

    .controller("MenuCtrl", function ($scope) {
        $scope.name = "Vegard";
        $scope.names = ["Kjell", "Geir", "Petter"];
    })

    .controller("MapCtrl", function ($scope) {
        $scope.name = "Map";

        $scope.ol = {};
        $scope.ol.center = {
            lat: 51.505,
            lon: -0.09,
            zoom: 8
        };

        $scope.ol.center = {
            lat: 9797587.027268754,
            lon: 2629703.3656816175,
            zoom: 5,
            projection: "EPSG:3857"
        };

        $scope.ol.layers = {
            main: {
                source: {
                    type: "OSM"
                }
            },
            statkart: {
                source: {
                    type: "XYZ",
                    url: "http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}"
                }
            }
        }
    });