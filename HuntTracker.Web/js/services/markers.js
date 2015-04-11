angular.module('HTServices')

    .factory('MarkerSource', ["$resource", "IconSource", function ($resource, IconSource) {
        var sources = $resource("/api/markers/:markerId", null, {
            getAll: { method: "GET", isArray: true },
            getByUserId: { method: "GET", isArray: true, params: { userId: "@userId" } },
            add: { method: "POST" },
            update: { method: "PUT" },
            remove: { method: "DELETE", params: { markerId: "@markerId" } }
        });

        sources.filterAndMap = function (markers) {
            if (!markers || markers.length < 1) return markers;
            var icons = IconSource.getAll();
            return markers.map(function (marker) {
                marker.iconSrc = icons[marker.icon] || icons["default"];
                return marker;
            });
        }

        return sources;
    }]);