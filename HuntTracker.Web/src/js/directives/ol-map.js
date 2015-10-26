/* global angular, $, ol, Hammer */

angular.module("HTDirectives")

    .directive("olMap", function () {
        return {
            restrict: "EA",
            template: "<div></div>",
            replace: true,
            scope: {
                markers: "=olMarkers",
                layer: "=olLayer",
                tracking: "=olTrackPosition",
                onPositionChanged: "&olOnPositionChanged",
                onMarkerSelected: "&olOnMarkerSelected",
                onShowContextMenu: "&olOnShowContextMenu",
                fitViewToMarkersTrigger: "=olFitViewToMarkersTrigger"
            },
            link: function (scope, element, attrs) {

                var layers = [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.BingMaps({
                            key: "AiRYpbYAESC89e7hUCnmi0L1lQBQWVRoF_MaVTeLQ4G8rTTpnabfM6Eg2VgQUtge",
                            imagerySet: "AerialWithLabels"
                        })
                    }),
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
                ];

                var view = new ol.View({
                    center: [2629703.3656816175, 9797587.027268754],
                    zoom: 5
                });

                var map = new ol.Map({
                    view: view,
                    interactions: ol.interaction.defaults({ pinchRotate: false, altShiftDragRotate: false }),
                    controls: ol.control.defaults({ attribution: false })
                });

                map.setTarget(element[0]);

                //Right click on PC
                $(map.getViewport()).on('contextmenu', function (e) {
                    e.preventDefault();
                    var eventPosition = map.getEventPixel(e);
                    var coordinates = map.getCoordinateFromPixel(eventPosition);
                    scope.$apply(function () {
                        scope.onShowContextMenu({ coordinates: coordinates });
                    });
                    return false;
                });

                //Touch devices like iPad - using element[0] instead of map.getViewport() to make it work on Windows Phone
                var elm = window.isWindowsPhone ? element[0] : map.getViewport();
                new Hammer.Manager(elm, {
                    recognizers: [
                        [Hammer.Press]
                    ]
                }).on('press', function (e) {
                    e.preventDefault();
                    var eventPosition = [e.center.x, e.center.y];
                    var coordinates = map.getCoordinateFromPixel(eventPosition);
                    scope.$apply(function () {
                        scope.onShowContextMenu({ coordinates: coordinates });
                    });
                    return false;
                });

                var adjacentPixels = function (pixel, r) {
                    var x = pixel[0], y = pixel[1], pixels = [];
                    for (var i = x - r; i <= x + r; i++) {
                        for (var j = y - r; j <= y + r; j++) {
                            pixels.push([i, j]);
                        }
                    }
                    return pixels;
                }

                $(map.getViewport()).on('click', function (e) {
                    var eventPosition = map.getEventPixel(e);
                    var feature = map.forEachFeatureAtPixel(eventPosition,
                        function (feature, layer) {
                            return feature;
                        });
                    
                    //If touch and no feature found at pixel, expand pixels to check.
                    //This extra checking can potensially take extra time.
                    if (!feature && Modernizr.touch) {
                        var pixelsToCheck = adjacentPixels(eventPosition, 5);
                        for (var i = 0; i < pixelsToCheck.length; i++) {
                            var pixel = pixelsToCheck[i];
                            feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                                return feature;
                            });
                            if (feature) { break; }
                        }
                    }

                    if (feature) {
                        scope.$apply(function () {
                            scope.onMarkerSelected({ marker: feature.marker });
                        });
                    }
                });

                //Geolocation - Tracking
                var geolocation = new ol.Geolocation({
                    projection: view.getProjection(),
                    trackingOptions: {
                        enableHighAccuracy: true,
                        maximumAge: 60000 //One minute
                    }
                });

                var setViewOnPositionChange = true;
                geolocation.on("change:position", function () {
                    var coordinates = geolocation.getPosition();
                    var accuracy = geolocation.getAccuracy();
                    if (setViewOnPositionChange) {
                        view.setCenter(coordinates);
                        view.setZoom(15);
                        setViewOnPositionChange = false;
                    }
                    scope.$apply(function () {
                        scope.onPositionChanged({ coordinates: coordinates, accuracy: accuracy });
                    });
                })

                scope.$watch("tracking", function (t) {
                    setViewOnPositionChange = true;
                    geolocation.setTracking(t);
                });

                //Markers
                var getIconStyle = function (iconSrc) {
                    if (iconSrc.type === 'font') {
                        return new ol.style.Style({
                            text: new ol.style.Text({
                                text: iconSrc.text,
                                font: iconSrc.font,
                                scale: 1,
                                fill: new ol.style.Fill({
                                    color: iconSrc.color || 'black',
                                })
                            })
                        });
                    }

                    return new ol.style.Style({
                        image: new ol.style.Icon(({
                            src: iconSrc.src,
                            offset: iconSrc.offset,
                            size: iconSrc.size,
                            scale: iconSrc.scale || 1,
                            snapToPixel: true,
                        }))
                    });
                };

                var markerSource = new ol.source.Vector();
                var markerLayer = new ol.layer.Vector({ source: markerSource });
                map.addLayer(markerLayer);

                var fitViewToMarkers = true;
                scope.$watch("markers", function (newMarkers, oldMarkers) {
                    //Remove all first
                    var features = markerSource.getFeatures();
                    for (var i = 0; i < features.length; i++) {
                        markerSource.removeFeature(features[i]);
                    }

                    //Re-add features.
                    if (newMarkers) {
                        for (var i = 0; i < newMarkers.length; i++) {
                            var marker = newMarkers[i];
                            if (!marker.hidden) {
                                var feature = new ol.Feature({
                                    geometry: new ol.geom.Point(marker.coordinates)
                                });
                                feature.marker = marker;
                                feature.setStyle(getIconStyle(marker.iconSrc));
                                markerSource.addFeature(feature);
                            }
                        }
                        if (fitViewToMarkers && newMarkers.length > 0) { //Happens first time
                            fitViewToMarkers = false;
                            map.updateSize();
                            view.fit(markerSource.getExtent(), map.getSize(), { maxZoom: 15 });
                        }
                    }
                }, true);
                
                scope.$watch("fitViewToMarkersTrigger", function () {
                    if(scope.markers && scope.markers.length > 0) {
                        view.fit(markerSource.getExtent(), map.getSize(), { maxZoom: 15 });
                    }
                });

                scope.$watch("layer", function () {
                    for (var index = 0; index < layers.length; index++) {
                        map.removeLayer(layers[index]);
                    }

                    if (scope.layer === "osm") {
                        map.addLayer(layers[0]);
                    }
                    else if (scope.layer === "satellite") {
                        map.addLayer(layers[1]);
                    }
                    else {
                        map.addLayer(layers[2]);
                    }
                    //Re-add to ensure on top
                    map.removeLayer(markerLayer);
                    map.addLayer(markerLayer);
                });
            }
        };
    });