angular.module('PushAppSources', ['ngResource'])
    .factory('TableSources', function ($resource) {
        var sources = $resource("/api/tablepushwidgets/:widgetId", null, {
            getAll: { method: "GET", isArray: true },
            getById: { method: "GET", params: { widgetId: "@widgetId" } },
            add: { method: "POST" },
            update: { method: "PUT" }
        });

        return sources;
    })

    .factory('MapSources', function ($resource) {
        var sources = $resource("/api/mappushwidgets/:widgetId", null, {
            getAll: { method: "GET", isArray: true },
            getById: { method: "GET", params: { widgetId: "@widgetId" } },
            add: { method: "POST" },
            update: { method: "PUT" }
        });

        return sources;
    })

    .factory('ChartSources', function ($resource) {
        var sources = $resource("/api/chartpushwidgets/:widgetId", null, {
            getAll: { method: "GET", isArray: true },
            getById: { method: "GET", params: { widgetId: "@widgetId" } },
            add: { method: "POST" },
            update: { method: "PUT" }
        });

        return sources;
    })

;