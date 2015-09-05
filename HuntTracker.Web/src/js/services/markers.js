angular.module('HTServices')

    .factory('MarkerSource', ["$resource", "IconSource", "$q", "$http", function ($resource, IconSource, $q, $http) {
        var sources = $resource("/api/markers/:markerId", null, {
            getAll: { method: "GET", isArray: true },
            getByUserId: { method: "GET", isArray: true, params: { userId: "@userId" } },
            add: { method: "POST" },
            update: { method: "PUT" },
            remove: { method: "DELETE", params: { markerId: "@markerId" } }
        });

        return sources;
    }]);