angular.module("HuntersDirectives")

    .directive("olMap", function ($compile) {
        return {
            restrict: "A",
            scope: {
                markers: "=olMarkers",
                tracking: "=olTrackPosition",
                onPositionChanged: "&olOnPositionChanged",
                onMarkerSelected: "&olOnMarkerSelected",
                onShowContextMenu: "&olOnShowContextMenu"
            },
            link: function (scope, element, attrs) {
                var view = new ol.View({
                    center: [2629703.3656816175, 9797587.027268754],
                    zoom: 5
                });

                var map = new ol.Map({
                    layers: [
                        new ol.layer.Tile({ source: new ol.source.OSM() }),
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                attributions: [
                                    new ol.Attribution({
                                        html: "&copy; <a href='http://statkart.no'>Kartverket</a>"
                                    })
                                ],
                                url: "http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}"
                            })
                        })
                    ],
                    view: view
                });

                map.setTarget(element[0]);

                //Createing a POPOVER element
                var popup = new ol.Overlay({ element: $("<div id='marker-element'></div>").appendTo("body") });
                map.addOverlay(popup);

                //Right click on PC
                $(map.getViewport()).on('contextmenu', function (e) {
                    e.preventDefault();
                    var eventPosition = map.getEventPixel(e);
                    var coordinates = map.getCoordinateFromPixel(eventPosition);
                    popup.setPosition(coordinates);
                    popup.setOffset([12, -25]);
                    scope.$apply(function () {
                        scope.onShowContextMenu({ coordinates: coordinates });
                    });
                    return false;
                });

                //Touch devices like iPad
                $(map.getViewport()).hammer().bind('press', function (e) {
                    e.preventDefault();
                    var eventPosition = [e.gesture.center.x, e.gesture.center.y];
                    var coordinates = map.getCoordinateFromPixel(eventPosition);
                    popup.setPosition(coordinates);
                    popup.setOffset([12, -25]);
                    scope.$apply(function () {
                        scope.onShowContextMenu({ coordinates: coordinates });
                    });
                    return false;
                });

                $(map.getViewport()).on('click', function (e) {
                    var eventPosition = map.getEventPixel(e);
                    var feature = map.forEachFeatureAtPixel(eventPosition,
                        function (feature, layer) {
                            return feature;
                        });
                    if (feature) {
                        var geometry = feature.getGeometry();
                        var coordinates = geometry.getCoordinates();
                        popup.setPosition(coordinates);
                        popup.setOffset([12, -25]);

                        scope.$apply(function () {
                            scope.onMarkerSelected({ marker: feature.marker });
                        });
                    }
                });

                //Geolocation - Tracking
                var geolocation = new ol.Geolocation({
                    projection: view.getProjection()
                });

                scope.$watch("tracking", function (t) {
                    geolocation.setTracking(t);
                    if (t) {
                        geolocation.once("change", function () {
                            var coordinates = geolocation.getPosition();
                            view.setCenter(coordinates);
                            view.setZoom(15);
                            scope.$apply(function () {
                                scope.onPositionChanged({ coordinates: coordinates });
                            });
                        });
                    }
                });

                //Markers
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */({
                        anchor: [0.45, 37],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'images/you.png'
                    }))
                });
                var vectorSource = new ol.source.Vector();
                var vectorLayer = new ol.layer.Vector({ source: vectorSource });
                map.addLayer(vectorLayer);
                scope.$watchCollection("markers", function (newMarkers, oldMarkers) {
                    //Remove all first
                    var features = vectorSource.getFeatures();
                    for (var i = 0; i < features.length; i++) {
                        vectorSource.removeFeature(features[i]);
                    }

                    //Re-add features.
                    if (newMarkers) {
                        for (var i = 0; i < newMarkers.length; i++) {
                            var marker = newMarkers[i];
                            var feature = new ol.Feature({
                                geometry: new ol.geom.Point(marker.coordinates)
                            });
                            feature.marker = marker;
                            feature.setStyle(iconStyle);
                            vectorSource.addFeature(feature);
                        }
                    }
                });
            }
        };
    });