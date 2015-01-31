angular.module('HTServices')

    .factory('MarkerSource', function ($resource) {
        var sources = $resource("/api/markers/:markerId", null, {
            getAll: { method: "GET", isArray: true },
            getByUserId: { method: "GET", isArray: true, params: { userId: "@userId" } },
            add: { method: "POST" },
            update: { method: "PUT" },
            remove: { method: "DELETE", params: { markerId: "@markerId" } }
        });

        return sources;
    });